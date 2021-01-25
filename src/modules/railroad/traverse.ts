import { Node, Pos } from "@/types"
import { Size, RenderNode, RenderConnect } from "./types"

import {
  CHART_PADDING_HORIZONTAL,
  CHART_PADDING_VERTICAL,
  NODE_PADDING_HORIZONTAL,
  NODE_PADDING_VERTICAL,
  NODE_MARGIN_VERTICAL,
  NODE_MARGIN_HORIZONTAL,
  ROOT_RADIUS,
  QUANTIFIER_HEIGHT,
  NAME_HEIGHT,
} from "./constants"
class Traverse {
  cachedSizeMap: Map<string, Size> = new Map()
  canvasRef: React.RefObject<HTMLCanvasElement>
  renderNodes: RenderNode[] = []
  renderConnects: RenderConnect[] = []
  chainNodes: Node[][] = []
  constructor(canvasRef: React.RefObject<HTMLCanvasElement>) {
    // the `measureText` method use canvas.measureText
    this.canvasRef = canvasRef
  }
  t(nodes: Node[]) {
    this.renderNodes = []
    this.renderConnects = []
    this.chainNodes = []
    this.cachedSizeMap.clear()

    let { width, height } = this.getNodesSize(nodes)
    width += CHART_PADDING_HORIZONTAL * 2
    height += CHART_PADDING_VERTICAL * 2

    this.traverseNodes(nodes, CHART_PADDING_HORIZONTAL, CHART_PADDING_VERTICAL)

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
    // todo: handle font-family
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

    const { val, branches, children } = node

    if (branches) {
      branches.forEach(nodes => {
        const { width: _width, height: _height } = this.getNodesSize(nodes)
        width += height += _height
        height += NODE_MARGIN_VERTICAL
        width = Math.max(width, _width)
      })
    } else if (children) {
      ;({ width, height } = this.getNodesSize(children))
      height += 2 * NODE_MARGIN_VERTICAL
      width += NODE_MARGIN_HORIZONTAL * 2
    } else if (val?.text) {
      const text = val.text
      const size = this.measureText(text)
      width = size.width + 2 * NODE_PADDING_HORIZONTAL
      height = size.height + 2 * NODE_PADDING_VERTICAL
    } else {
      width = ROOT_RADIUS
      height = ROOT_RADIUS
    }

    if (node.quantifier) {
      const { quantifier } = node
      const { max, min, text } = quantifier
      // quantifier curve
      if (min === 0) {
        paddingTop += QUANTIFIER_HEIGHT
      }
      if (max > 1) {
        paddingBottom += QUANTIFIER_HEIGHT
      }

      // handle times text
      if (text) {
        paddingBottom += NAME_HEIGHT
        const textWidth =
          this.measureText(text, 12).width + NODE_PADDING_VERTICAL * 2
        offsetWidth = Math.max(textWidth, width, offsetWidth)
      }
    }

    // handle name
    if (val?.name) {
      const { name, namePrefix = "" } = val
      const nameWidth =
        this.measureText(name + namePrefix, 12).width +
        NODE_PADDING_VERTICAL * 2

      offsetWidth = Math.max(width, nameWidth, offsetWidth)
      paddingTop += NAME_HEIGHT
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

  getNodesSize(nodes: Node[]) {
    let height = 0
    let width = 0
    nodes.forEach(node => {
      const size = this.getSize(node)
      height = Math.max(height, size.offsetHeight)
      width += size.offsetWidth
    })

    width += NODE_MARGIN_HORIZONTAL * (nodes.length - 1)
    return { width, height }
  }

  // traverse complex Node, ChoiceNode, GroupNode, LookaroundAssertionNode
  traverseNode(node: Node, x: number, y: number) {
    if (node.branches) {
      this.traverseBranches(node, x, y)
    }
    if (node.children) {
      this.traverseChildren(node, x, y)
    }
  }

  traverseChildren(node: Node, x: number, y: number) {
    const { offsetWidth, offsetHeight } = this.getSize(node)
    const { children = [] } = node
    this.traverseNodes(
      children,
      x,
      y,
      offsetWidth,
      offsetHeight,
      y + offsetHeight / 2
    )
  }

  traverseBranches(node: Node, x: number, y: number) {
    const { branches = [] } = node
    const choiceSize = this.getSize(node)
    const maxWidth = choiceSize.offsetWidth
    const centerY = y + choiceSize.offsetHeight / 2

    branches.forEach(branch => {
      let maxHeight = this.getNodesSize(branch).height
      maxHeight += NODE_MARGIN_VERTICAL
      this.traverseNodes(branch, x, y, maxWidth, maxHeight, centerY)
      y += maxHeight
    })
  }

  traverseNodes(
    nodes: Node[],
    x: number,
    y: number,
    width?: number,
    height?: number,
    connectY?: number
  ) {
    const originX = x

    let { width: nodesWidth, height: nodesHeight } = this.getNodesSize(nodes)

    if (width) {
      x += (width - nodesWidth) / 2
    }
    if (height) {
      y += (height - nodesHeight) / 2
    }
    const centerY = y + nodesHeight / 2

    let connect: Pos | null = null
    if (connectY) {
      connect = {
        x: originX,
        y: connectY,
      }
    }

    nodes.forEach((node, index) => {
      const size = this.getSize(node)
      const deltaY = (nodesHeight - size.offsetHeight) / 2
      this.traverseNode(node, x, y + deltaY)

      // push head connect and body connect
      if (connect) {
        this.renderConnects.push({
          id: node.id + "split",
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
      this.preRenderNode(node, x, y + deltaY)

      x += size.offsetWidth
      x += NODE_MARGIN_HORIZONTAL

      // push tail connect
      if (width && connectY && index === nodes.length - 1) {
        this.renderConnects.push({
          id: node.id + "combine",
          type: "combine",
          start: { ...connect },
          end: {
            x: originX + width,
            y: connectY,
          },
        })
      }
    })

    this.chainNodes.unshift(nodes)
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
    // make sure parent nodes are front of their children nodes
    this.renderNodes.unshift(preRenderNode)
  }
}

export default Traverse
