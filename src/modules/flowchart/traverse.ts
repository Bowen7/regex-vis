import {
  Node,
  ChoiceNode,
  GroupNode,
  Pos,
  SingleNode,
  RootNode,
  LookaroundAssertionNode,
} from "@types"
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
  cachedSizeMap: Map<string, Size> = new Map()
  canvasRef: React.RefObject<HTMLCanvasElement>
  renderNodes: RenderNode[] = []
  renderConnects: RenderConnect[] = []
  chainIds: string[][] = []
  constructor(canvasRef: React.RefObject<HTMLCanvasElement>) {
    this.canvasRef = canvasRef
  }
  t(root: RootNode) {
    this.renderNodes = []
    this.renderConnects = []
    this.cachedSizeMap = new Map()
    this.chainIds = []
    let { width, height } = this.traverseChain(
      root,
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
  getSize(node: Node) {
    const cachedSize = this.cachedSizeMap.get(node.id)
    if (cachedSize) {
      return cachedSize
    }
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
        const { chains } = node
        chains.forEach(chain => {
          let _width = 0
          let _height = 0
          let cur = chain
          while (cur !== null) {
            const size = this.getSize(cur)
            _width += size.offsetWidth
            _width += FLOW_NODE_MARGIN_HORIZONTAL * 2
            _height = Math.max(size.offsetHeight, _height)
            cur = cur.next
          }
          height += _height
          height += FLOW_NODE_MARGIN_VERTICAL * 2
          width = Math.max(width, _width)
        })
        width += FLOW_CHOICE_PADDING_HORIZONTAL * 2
        break

      case "group":
      case "lookaroundAssertion":
        const { chain } = node
        let cur = chain
        while (cur !== null) {
          const size = this.getSize(cur)
          width += size.offsetWidth
          width += FLOW_NODE_MARGIN_HORIZONTAL * 2
          height = size.offsetHeight
          cur = cur.next
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
    this.cachedSizeMap.set(node.id, size)
    return size
  }
  getChainHeight(start: Node) {
    let cur: Node | null = start
    let height = 0
    while (cur !== null) {
      const size = this.getSize(cur)
      height = Math.max(height, size.offsetHeight)
      cur = cur.next
    }
    return height
  }
  traverseNode(node: Node, x: number, y: number) {
    switch (node.type) {
      case "choice":
        this.traverseChoice(node, x, y)
        break
      case "group":
      case "lookaroundAssertion":
        this.traverseGroup(node, x, y)
        break
      default:
        break
    }
  }
  traverseGroup(
    node: GroupNode | LookaroundAssertionNode,
    x: number,
    y: number
  ) {
    const { offsetWidth, offsetHeight } = this.getSize(node)
    const { chain } = node
    this.traverseChain(
      chain as Node,
      x,
      y,
      offsetWidth,
      offsetHeight,
      y + offsetHeight / 2
    )
  }
  traverseChoice(node: ChoiceNode, x: number, y: number) {
    const { chains } = node
    const choiceSize = this.getSize(node)
    const maxWidth = choiceSize.offsetWidth
    const centerY = y + choiceSize.offsetHeight / 2

    chains.forEach(chain => {
      let maxHeight = this.getChainHeight(chain as Node)
      maxHeight += FLOW_NODE_MARGIN_VERTICAL * 2
      this.traverseChain(chain as Node, x, y, maxWidth, maxHeight, centerY)
      y += maxHeight
    })
  }
  traverseChain(
    chain: Node,
    x: number,
    y: number,
    width?: number,
    height?: number,
    connectY?: number
  ) {
    const originX = x
    let concatenationHeight = 0
    let concatenationWidth = 0
    let cur: null | Node = chain
    let ids = []
    while (cur !== null) {
      const size = this.getSize(cur)
      concatenationHeight = Math.max(concatenationHeight, size.offsetHeight)
      concatenationWidth += size.offsetWidth + FLOW_NODE_MARGIN_HORIZONTAL * 2
      ids.push(cur.id)
      cur = cur.next
    }

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

    cur = chain
    while (cur !== null) {
      const size = this.getSize(cur)
      const deltaY = (concatenationHeight - size.offsetHeight) / 2
      this.traverseNode(cur, x, y + deltaY)

      // head connect and body connect
      if (connect) {
        this.renderConnects.push({
          id: cur.id + "split",
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
      this.preRenderNode(cur, x, y + deltaY)

      x += size.offsetWidth
      x += FLOW_NODE_MARGIN_HORIZONTAL * 2

      // tail connect
      if (width && connectY && cur.next === null) {
        this.renderConnects.push({
          id: cur.id + "combine",
          type: "combine",
          start: { ...connect },
          end: {
            x: originX + width,
            y: connectY,
          },
        })
      }
      cur = cur.next
    }
    this.chainIds.unshift(ids)
    return {
      width: x - originX,
      height: concatenationHeight,
    }
  }
  preRenderNode(node: Node, x: number, y: number) {
    const size = this.getSize(node)
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
