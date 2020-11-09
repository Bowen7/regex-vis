import { NodeMap, Node, ChoiceNode, GroupNode, Pos, SingleNode } from "@types"
import { Size, RenderNode, RenderConnect } from "./types"
import { hasName, hasQuantifier } from "../../utils"

import {
  FLOWCHART_PADDING_HORIZONTAL,
  FLOWCHART_PADDING_VERTICAL,
  FLOW_NODE_PADDING_HORIZONTAL,
  FLOW_NODE_PADDING_VERTICAL,
  FLOW_NODE_MARGIN_VERTICAL,
  FLOW_NODE_MARGIN_HORIZONTAL,
  FLOW_CHOICE_PADDING_HORIZONTAL,
  FLOW_ROOT_PADDING,
  FLOW_QUANTIFIER_HEIGHT,
  FLOW_GROUP_PADDING_VERTICAL,
  FLOW_NAME_HEIGHT,
} from "./consts"
class Traverse {
  nodeMap!: NodeMap
  cachedSizeMap: Map<number, Size> = new Map()
  canvasRef: React.RefObject<HTMLCanvasElement>
  renderNodes: RenderNode[] = []
  renderConnects: RenderConnect[] = []
  concatenations: number[][] = []
  constructor(canvasRef: React.RefObject<HTMLCanvasElement>) {
    this.canvasRef = canvasRef
  }
  t(nodeMap: NodeMap, root: number) {
    this.renderNodes = []
    this.renderConnects = []
    this.cachedSizeMap = new Map()
    this.nodeMap = nodeMap
    const concatenation: number[] = []
    let cur: number | null = root
    while (cur !== null) {
      let curNode: Node
      if (typeof cur === "number") {
        concatenation.push(cur)
        curNode = nodeMap.get(cur) as Node
      } else {
        curNode = cur
      }
      cur = curNode.next
    }
    let { width, height } = this.traverseConcatenation(
      concatenation,
      FLOWCHART_PADDING_HORIZONTAL,
      FLOWCHART_PADDING_VERTICAL
    )
    width += FLOWCHART_PADDING_HORIZONTAL * 2
    height += FLOWCHART_PADDING_VERTICAL * 2
    const { renderNodes, renderConnects } = this
    return {
      width,
      height,
      renderNodes,
      renderConnects,
    }
  }
  measureText(text: string, fontSize: number = 16) {
    const context = this.canvasRef.current?.getContext("2d")
    if (!context) {
      return { width: 0, height: 0 }
    }
    // todo
    context.font = fontSize + "px Arial"
    const metrics = context.measureText(text)
    return { width: metrics.width, height: fontSize }
  }
  getSize(id: number) {
    const cachedSize = this.cachedSizeMap.get(id)
    if (cachedSize) {
      return cachedSize
    }
    const node = this.nodeMap.get(id) as Node
    let width = 0
    let height = 0
    let offsetWidth = 0
    let offsetHeight = 0
    let paddingTop = 0
    let paddingBottom = 0
    switch (node.type) {
      case "root": {
        const text = node.text
        const size = this.measureText(text)
        width = size.width + 2 * FLOW_ROOT_PADDING
        height = width
        break
      }
      case "single":
      case "boundaryAssertion":
        const text = node.text
        const size = this.measureText(text)
        width = size.width + 2 * FLOW_NODE_PADDING_HORIZONTAL
        height = size.height + 2 * FLOW_NODE_PADDING_VERTICAL
        break

      case "choice":
        const { branches } = node
        branches.forEach(branch => {
          let _width = 0
          let _height = 0
          let cur = branch
          while (cur !== id) {
            const size = this.getSize(cur)
            _width += size.offsetWidth
            _width += FLOW_NODE_MARGIN_HORIZONTAL * 2
            _height = Math.max(size.offsetHeight, _height)
            const nextNode = this.nodeMap.get(cur) as Node
            cur = nextNode.next as number
          }
          height += _height
          height += FLOW_NODE_MARGIN_VERTICAL * 2
          width = Math.max(width, _width)
        })
        width += FLOW_CHOICE_PADDING_HORIZONTAL * 2
        break

      case "group":
      case "lookaroundAssertion":
        const { head } = node
        let cur = head
        while (cur !== id) {
          const size = this.getSize(cur)
          width += size.offsetWidth
          width += FLOW_NODE_MARGIN_HORIZONTAL * 2
          height = size.offsetHeight
          const curNode = this.nodeMap.get(cur) as Node
          cur = curNode.next as number
        }

        height += 2 * FLOW_GROUP_PADDING_VERTICAL

        break
      default:
        break
    }
    // quantifier
    if (hasQuantifier(node) && node.quantifier) {
      const { quantifier } = node
      const { max, min, text } = quantifier
      // quantifier curve
      if (min === 0) {
        paddingTop += FLOW_QUANTIFIER_HEIGHT
      }
      if (max > 1) {
        paddingBottom += FLOW_QUANTIFIER_HEIGHT
      }

      // times text
      if (text) {
        paddingBottom += FLOW_NAME_HEIGHT
        const textWidth =
          this.measureText(text, 12).width + FLOW_NODE_PADDING_VERTICAL * 2
        offsetWidth = Math.max(textWidth, width, offsetWidth)
      }
    }

    // name
    if (hasName(node) && node.name) {
      const { name } = node
      const nameWidth =
        this.measureText(name, 12).width + FLOW_NODE_PADDING_VERTICAL * 2

      offsetWidth = Math.max(width, nameWidth, offsetWidth)
      paddingTop += FLOW_NAME_HEIGHT
    }

    offsetHeight = height + Math.max(paddingTop, paddingBottom) * 2
    offsetWidth = Math.max(offsetWidth, width)
    const size: Size = {
      width,
      height,
      offsetWidth,
      offsetHeight,
    }
    this.cachedSizeMap.set(id, size)
    return size
  }
  traverseUnknownType(id: number, x: number, y: number) {
    const node = this.nodeMap.get(id) as Node
    switch (node.type) {
      case "choice":
        this.traverseChoice(id, x, y)
        break
      case "group":
      case "lookaroundAssertion":
        this.traverseGroup(id, x, y)
        break
      default:
        break
    }
  }
  traverseGroup(id: number, x: number, y: number) {
    const node = this.nodeMap.get(id) as GroupNode
    const { offsetWidth, offsetHeight } = this.getSize(id)
    const { head } = node
    const concatenation: number[] = []
    let cur = head
    while (cur !== id) {
      concatenation.push(cur)
      const curNode = this.nodeMap.get(cur) as Node
      cur = curNode.next as number
    }
    this.traverseConcatenation(
      concatenation,
      x,
      y,
      offsetWidth,
      offsetHeight,
      y + offsetHeight / 2
    )
  }
  traverseChoice(id: number, x: number, y: number) {
    const node = this.nodeMap.get(id) as ChoiceNode
    const { branches } = node
    const choiceSize = this.getSize(id)
    const maxWidth = choiceSize.offsetWidth
    const centerY = y + choiceSize.offsetHeight / 2

    branches.forEach(branch => {
      let cur = branch
      let maxHeight = 0
      const concatenation: number[] = []
      while (cur !== id) {
        concatenation.push(cur)
        const curNode = this.nodeMap.get(cur) as Node
        const size = this.getSize(cur)
        maxHeight = Math.max(maxHeight, size.offsetHeight)
        cur = curNode.next as number
      }
      maxHeight += FLOW_NODE_MARGIN_VERTICAL * 2
      this.traverseConcatenation(
        concatenation,
        x,
        y,
        maxWidth,
        maxHeight,
        centerY
      )
      y += maxHeight
    })
  }
  traverseConcatenation(
    concatenation: number[],
    x: number,
    y: number,
    width?: number,
    height?: number,
    connectY?: number
  ) {
    const originX = x
    let concatenationHeight = 0
    let concatenationWidth = 0
    concatenation.forEach(id => {
      const size = this.getSize(id)
      concatenationHeight = Math.max(concatenationHeight, size.offsetHeight)
      concatenationWidth += size.offsetWidth + FLOW_NODE_MARGIN_HORIZONTAL * 2
    })

    concatenationWidth -= FLOW_NODE_MARGIN_HORIZONTAL * 2

    if (width) {
      x += (width - concatenationWidth) / 2
    }
    if (height) {
      y += (height - concatenationHeight) / 2
    }
    const centerY = y + concatenationHeight / 2

    let connect: Pos | null = null
    if (connectY) {
      connect = {
        x: originX,
        y: connectY,
      }
    }
    concatenation.forEach((id, index) => {
      const size = this.getSize(id)
      const deltaY = (concatenationHeight - size.offsetHeight) / 2
      this.traverseUnknownType(id, x, y + deltaY)

      // head connect and body connect
      if (connect) {
        this.renderConnects.push({
          id: id + "split",
          type: "split",
          start: { ...connect },
          end: {
            x: x + (size.offsetWidth - size.width) / 2,
            y: centerY,
          },
        })
      }
      connect = {
        x: x + (size.offsetWidth + size.width) / 2,
        y: centerY,
      }
      this.preRenderNode(id, x, y + deltaY)

      x += size.offsetWidth
      x += FLOW_NODE_MARGIN_HORIZONTAL * 2

      // tail connect
      if (width && connectY && index === concatenation.length - 1) {
        this.renderConnects.push({
          id: id + "combine",
          type: "combine",
          start: { ...connect },
          end: {
            x: originX + width,
            y: connectY,
          },
        })
      }
    })
    this.concatenations.unshift(concatenation)
    return {
      width: x - originX,
      height: concatenationHeight,
    }
  }
  preRenderNode(id: number, x: number, y: number) {
    const node = this.nodeMap.get(id) as Node
    const size = this.getSize(id)
    let { width, height, offsetWidth, offsetHeight } = size
    x += (offsetWidth - width) / 2
    y += (offsetHeight - height) / 2

    const preRenderNode: RenderNode = {
      x,
      y,
      width,
      height,
      node,
    }
    this.renderNodes.unshift(preRenderNode)
  }
}

export default Traverse
