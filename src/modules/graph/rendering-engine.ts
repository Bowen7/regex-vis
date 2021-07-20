import { nanoid } from "nanoid"
import { AST } from "@/parser"
import { RenderNode, RenderVirtualNode, Size } from "./types"
import {
  CHART_PADDING_HORIZONTAL,
  CHART_PADDING_VERTICAL,
  MINIMUM_CHART_PADDING_HORIZONTAL,
  MINIMUM_CHART_PADDING_VERTICAL,
  NODE_PADDING_HORIZONTAL,
  NODE_PADDING_VERTICAL,
  NODE_MARGIN_VERTICAL,
  NODE_MARGIN_HORIZONTAL,
  NODE_TEXT_FONTSIZE,
  ROOT_RADIUS,
  QUANTIFIER_HEIGHT,
  NAME_HEIGHT,
  BRANCH_PADDING_HORIZONTAL,
  TEXT_PADDING_VERTICAL,
  QUANTIFIER_TEXT_FONTSIZE,
  QUANTIFIER_ICON_WIDTH,
  QUANTIFIER_ICON_MARGIN_RIGHT,
  NAME_TEXT_FONTSIZE,
} from "@/constants/graph"
import { font } from "@/constants/style"
import { getQuantifierText } from "@/parser/utils/quantifier"
import { getTextsWithBacktick, getName } from "./utils"

type TextSize = { width: number; height: number }
const textSizeMap = new Map<string, TextSize>()
class RenderEngine {
  minimum: boolean = false
  canvas: HTMLCanvasElement
  context: CanvasRenderingContext2D | null
  head: AST.RootNode = { id: nanoid(), type: "root" }
  tail: AST.RootNode = { id: nanoid(), type: "root" }
  constructor() {
    // the `measureText` method use canvas.measureText
    if (process.env.EXPORT) {
      const { createCanvas } = require("canvas")
      this.canvas = createCanvas()
    } else {
      this.canvas = document.createElement("canvas")
    }
    this.context = this.canvas.getContext("2d")
  }

  render(ast: AST.Regex, minimum = false) {
    this.minimum = minimum
    const { body } = ast
    const nodes = [this.head, ...body, this.tail]
    const { width, height } = this.getNodesSize(nodes)
    const paddingHorizontal = minimum
      ? MINIMUM_CHART_PADDING_HORIZONTAL
      : CHART_PADDING_HORIZONTAL
    const paddingVertical = minimum
      ? MINIMUM_CHART_PADDING_VERTICAL
      : CHART_PADDING_VERTICAL
    const rootRenderNode: RenderVirtualNode = {
      type: "virtual",
      width: width,
      height: height,
      x: paddingHorizontal,
      y: paddingVertical,
      children: [],
    }
    this.renderNodes(rootRenderNode, nodes)
    rootRenderNode.width += paddingHorizontal * 2
    rootRenderNode.height += paddingVertical * 2
    return rootRenderNode
  }

  renderNodes(
    parentRenderNode: RenderNode | RenderVirtualNode,
    nodes: AST.Node[]
  ) {
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
    if (target.type === "group" || target.type === "lookAroundAssertion") {
      this.renderNodes(renderNode, target.children)
    } else if (target.type === "choice") {
      const { branches } = target
      const { x: originX, y: originY, width, height } = renderNode
      let x = originX
      let y = originY

      const padding = NODE_MARGIN_HORIZONTAL + BRANCH_PADDING_HORIZONTAL
      branches.forEach((branch) => {
        const branchHeight =
          this.getNodesSize(branch).height + NODE_MARGIN_VERTICAL

        children.push({
          id: nanoid(),
          type: "connect",
          start: { x, y: originY + height / 2 },
          end: {
            x: x + padding,
            y: y + branchHeight / 2,
          },
        })
        const virtualNode: RenderVirtualNode = {
          type: "virtual",
          x: x + padding,
          y,
          width: width - padding * 2,
          height: branchHeight,
          children: [],
        }
        children.push(virtualNode)
        children.push({
          id: nanoid(),
          type: "connect",
          start: { x: x + width - padding, y: y + branchHeight / 2 },
          end: { x: x + width, y: originY + height / 2 },
        })
        this.renderNodes(virtualNode, branch)
        y += branchHeight
      })
    }
  }

  measureText(text: string, fontSize: number = 16) {
    const context = this.context
    if (!context) {
      return { width: 0, height: 0 }
    }
    const textFont = fontSize + "px " + font.family
    const key = textFont + "-" + text
    if (textSizeMap.has(key)) {
      return textSizeMap.get(key) as TextSize
    }
    context.font = textFont
    const metrics = context.measureText(text)
    const size = { width: metrics.width, height: fontSize }
    textSizeMap.set(key, size)
    return size
  }

  measureTexts(texts: string[] | string, fontSize: number = 16) {
    if (typeof texts === "string") {
      return this.measureText(texts, fontSize)
    }
    return texts
      .map((text) => this.measureText(text, fontSize))
      .reduce(
        ({ width: prevWidth, height: prevHeight }, { width, height }) => ({
          width: Math.max(width, prevWidth),
          height: height + prevHeight + TEXT_PADDING_VERTICAL,
        }),
        { width: 0, height: -TEXT_PADDING_VERTICAL }
      )
  }

  getSize(node: AST.Node) {
    let width = 0
    let height = 0
    let offsetWidth = 0
    let offsetHeight = 0
    let paddingTop = 0
    let paddingBottom = 0

    const texts = getTextsWithBacktick(node)

    if (node.type === "choice") {
      node.branches.forEach((nodes) => {
        let { width: branchWidth, height: branchHeight } =
          this.getNodesSize(nodes)
        height += branchHeight
        height += NODE_MARGIN_VERTICAL
        branchWidth +=
          NODE_MARGIN_HORIZONTAL * 2 + BRANCH_PADDING_HORIZONTAL * 2
        width = Math.max(width, branchWidth)
      })
    } else if (node.type === "group" || node.type === "lookAroundAssertion") {
      ;({ width, height } = this.getNodesSize(node.children))
      height += 2 * NODE_MARGIN_VERTICAL
      width += NODE_MARGIN_HORIZONTAL * 2
    } else if (texts) {
      const size = this.measureTexts(texts, NODE_TEXT_FONTSIZE)
      width = size.width + 2 * NODE_PADDING_HORIZONTAL
      height = size.height + 2 * NODE_PADDING_VERTICAL
    } else {
      if (!this.minimum) {
        width = ROOT_RADIUS
        height = ROOT_RADIUS
      }
    }

    if (
      (node.type === "character" || node.type === "group") &&
      node.quantifier
    ) {
      const { quantifier } = node
      paddingBottom += QUANTIFIER_HEIGHT

      const text = getQuantifierText(quantifier)
      // handle times text
      if (text) {
        const quantifierWidth =
          this.measureText(text, QUANTIFIER_TEXT_FONTSIZE).width +
          QUANTIFIER_ICON_WIDTH +
          QUANTIFIER_ICON_MARGIN_RIGHT
        offsetWidth = Math.max(quantifierWidth, width, offsetWidth)
      }
    }

    // handle name
    const name = getName(node)
    if (name) {
      const nameWidth =
        this.measureText(name, NAME_TEXT_FONTSIZE).width +
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

  getNodesSize(nodes: AST.Node[]) {
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

const renderEngine = new RenderEngine()
export default renderEngine
