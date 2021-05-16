import { nanoid } from "nanoid"
import { Node, RenderNode, RenderVirtualNode, Size } from "@/types"
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
} from "@/constants/railroad"
import { font } from "@/constants/style"
import { getQuantifierText } from "@/parser/utils/quantifier"
class Traverse {
  canvas: HTMLCanvasElement
  minimum: boolean
  constructor(minimum = false) {
    // the `measureText` method use canvas.measureText
    this.canvas = document.createElement("canvas")
    this.minimum = minimum
  }
  render(nodes: Node[]) {
    const { minimum } = this
    const { width, height } = this.getNodesSize(nodes)
    const rootRenderNode: RenderVirtualNode = {
      type: "virtual",
      width: width,
      height: height,
      x: minimum ? 0 : CHART_PADDING_HORIZONTAL,
      y: minimum ? 0 : CHART_PADDING_VERTICAL,
      children: [],
    }
    this.renderNodes(rootRenderNode, nodes)
    if (!minimum) {
      rootRenderNode.width += CHART_PADDING_HORIZONTAL * 2
      rootRenderNode.height += CHART_PADDING_VERTICAL * 2
    }
    return rootRenderNode
  }
  renderNodes(parentRenderNode: RenderNode | RenderVirtualNode, nodes: Node[]) {
    const {
      x: originX,
      y: originY,
      width: parentWidth,
      height: parentHeight,
      children,
    } = parentRenderNode
    const { width } = this.getNodesSize(nodes)
    const deltaX = (parentWidth - width) / 2
    const connectY = originY + parentHeight / 2
    let x = originX

    if (nodes.length === 0) {
      return
    }
    const head = nodes[0]
    const tail = nodes[nodes.length - 1]

    let paddingLeft = 0
    let paddingRight = 0
    if (head.type !== "root") {
      const headSize = this.getSize(head)
      paddingLeft = (headSize.offsetWidth - headSize.width) / 2
      children.push({
        type: "connect",
        id: nanoid(),
        start: { x, y: connectY },
        end: { x: (x += deltaX + paddingLeft), y: connectY },
      })
    }
    nodes.forEach((node, index) => {
      const size = this.getSize(node)
      paddingLeft = (size.offsetWidth - size.width) / 2
      if (index !== 0) {
        children.push({
          type: "connect",
          id: nanoid(),
          start: { x, y: connectY },
          end: {
            x: (x += NODE_MARGIN_HORIZONTAL + paddingLeft + paddingRight),
            y: connectY,
          },
        })
      }
      const renderNode: RenderNode = {
        type: "node",
        id: node.id,
        x,
        y: originY + (parentHeight - size.height) / 2,
        width: size.width,
        height: size.height,
        target: node,
        children: [],
      }
      children.push(renderNode)
      x += size.width
      this.renderNode(renderNode)

      paddingRight = paddingLeft
    })
    if (tail.type !== "root") {
      children.push({
        type: "connect",
        id: nanoid(),
        start: { x, y: connectY },
        end: { x: (x += deltaX + paddingRight), y: connectY },
      })
    }
  }
  renderNode(renderNode: RenderNode) {
    const { target, children } = renderNode
    if (target.children) {
      this.renderNodes(renderNode, target.children)
    } else if (target?.branches) {
      const { branches } = target
      const { x: originX, y: originY, width, height } = renderNode
      let x = originX
      let y = originY
      branches.forEach((branch) => {
        const branchHeight =
          this.getNodesSize(branch).height + NODE_MARGIN_VERTICAL

        children.push({
          id: nanoid(),
          type: "connect",
          start: { x, y: originY + height / 2 },
          end: { x: x + 20, y: y + branchHeight / 2 },
        })
        const virtualNode: RenderVirtualNode = {
          type: "virtual",
          x: x + 20,
          y,
          width: width - 40,
          height: branchHeight,
          children: [],
        }
        children.push(virtualNode)
        children.push({
          id: nanoid(),
          type: "connect",
          start: { x: x + width - 20, y: y + branchHeight / 2 },
          end: { x: x + width, y: originY + height / 2 },
        })
        this.renderNodes(virtualNode, branch)
        y += branchHeight
      })
    }
  }
  measureText(text: string, fontSize: number = 16) {
    const context = this.canvas.getContext("2d")
    if (!context) {
      return { width: 0, height: 0 }
    }
    context.font = fontSize + "px " + font.family
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
      branches.forEach((nodes) => {
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
    } else if ("text" in node) {
      const text = node.text
      const size = this.measureText(text)
      width = size.width + 2 * NODE_PADDING_HORIZONTAL
      height = size.height + 2 * NODE_PADDING_VERTICAL
    } else {
      width = ROOT_RADIUS
      height = ROOT_RADIUS
    }

    if (node.quantifier) {
      const { quantifier } = node
      const { max, min } = quantifier
      // quantifier curve
      if (min === 0) {
        paddingTop += QUANTIFIER_HEIGHT
      }
      if (max > 1) {
        paddingBottom += QUANTIFIER_HEIGHT
      }

      const text = getQuantifierText(quantifier)
      // handle times text
      if (text) {
        paddingBottom += NAME_HEIGHT
        const textWidth =
          this.measureText(text, 12).width + NODE_PADDING_VERTICAL * 2
        offsetWidth = Math.max(textWidth, width, offsetWidth)
      }
    }

    // handle name
    if ("name" in node || val?.name) {
      const name = "name" in node ? node.name : val.name
      const { namePrefix = "" } = val
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
    nodes.forEach((node) => {
      const size = this.getSize(node)
      height = Math.max(height, size.offsetHeight)
      width += size.offsetWidth
    })

    width += NODE_MARGIN_HORIZONTAL * (nodes.length - 1)
    return { width, height }
  }
}

export default Traverse
