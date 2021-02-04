import { nanoid } from "nanoid"
import { Node, Pos, RenderNode, RenderVirtualNode, Size } from "@/types"
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
  BRANCH_PADDING_HORIZONTAL,
} from "./constants"
class Traverse {
  canvasRef: React.RefObject<HTMLCanvasElement>
  constructor(canvasRef: React.RefObject<HTMLCanvasElement>) {
    // the `measureText` method use canvas.measureText
    this.canvasRef = canvasRef
  }
  render(nodes: Node[]) {
    const { width, height } = this.getNodesSize(nodes)
    const rootRenderNode: RenderVirtualNode = {
      type: "virtual",
      width: width,
      height: height,
      x: CHART_PADDING_HORIZONTAL,
      y: CHART_PADDING_VERTICAL,
      children: [],
    }
    this.renderNodes(rootRenderNode, nodes)
    return rootRenderNode
  }
  renderNodes(parentRenderNode: RenderNode | RenderVirtualNode, nodes: Node[]) {
    const {
      x: originX,
      y: originY,
      width: parentWidth,
      children,
    } = parentRenderNode
    const { width, height } = this.getNodesSize(nodes)
    const deltaX = (parentWidth - width) / 2
    const connectY = originY + height / 2
    let x = originX

    const head = nodes[0]
    const tail = nodes[nodes.length - 1]
    if (head.type !== "root") {
      children.push({
        type: "connect",
        id: nanoid(),
        start: { x, y: connectY },
        end: { x: (x += deltaX), y: connectY },
      })
    }
    nodes.forEach((node, index) => {
      if (index !== 0) {
        children.push({
          type: "connect",
          id: nanoid(),
          start: { x, y: connectY },
          end: { x: (x += deltaX), y: connectY },
        })
      }
      const size = this.getSize(node)
      const renderNode: RenderNode = {
        type: "node",
        id: node.id,
        x,
        y: originY + (height - size.height) / 2,
        width: size.width,
        height: size.height,
        target: node,
        children: [],
      }
      this.renderNode(parentRenderNode, renderNode)
    })
    if (tail.type !== "root") {
      children.push({
        type: "connect",
        id: nanoid(),
        start: { x, y: connectY },
        end: { x: (x += NODE_MARGIN_HORIZONTAL), y: connectY },
      })
    }
    parentRenderNode.width = width
    parentRenderNode.height = height
  }
  renderNode(
    parentRenderNode: RenderNode | RenderVirtualNode,
    renderNode: RenderNode
  ) {
    const { target } = renderNode
    if (target?.children) {
      this.renderNodes(parentRenderNode, target.children)
    } else if (target?.branches) {
      const { branches } = target
      const { x: originX, y: originY, width } = renderNode
      let x = originX
      let y = originY
      branches.forEach(branch => {
        const branchHeight =
          this.getNodesSize(branch).height + NODE_MARGIN_VERTICAL
        const virtualNode: RenderVirtualNode = {
          type: "virtual",
          x,
          y,
          width,
          height: branchHeight,
          children: [],
        }
        this.renderNodes(virtualNode, branch)
        y += branchHeight
      })
    }
  }
  measureText(text: string, fontSize: number = 16) {
    const context = this.canvasRef.current?.getContext("2d")
    if (!context) {
      return { width: 0, height: 0 }
    }
    context.font = fontSize + "px Consolas, Monaco, monospace"
    const metrics = context.measureText(text)
    return { width: metrics.width, height: fontSize }
  }

  getSize(node: Node) {
    let width = 0
    let height = 0
    let offsetWidth = 0
    let offsetHeight = 0
    let paddingTop = 0
    let paddingBottom = 0

    const { val, branches, children } = node

    if (branches) {
      branches.forEach(nodes => {
        let { width: branchWidth, height: branchHeight } = this.getNodesSize(
          nodes
        )
        height += branchHeight
        height += NODE_MARGIN_VERTICAL
        branchWidth +=
          NODE_MARGIN_HORIZONTAL * 2 + BRANCH_PADDING_HORIZONTAL * 2
        width = Math.max(width, branchWidth)
      })
    } else if (children) {
      ;({ width, height } = this.getNodesSize(children))
      height += 2 * NODE_MARGIN_VERTICAL
      width += NODE_MARGIN_HORIZONTAL * 2
    } else if (val?.text || val?.text === "") {
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
}

export default Traverse
