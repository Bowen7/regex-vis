import { nanoid } from "nanoid"
import { AST } from "@/parser"
import { RenderNode, RenderConnect, Size, LayoutChildren, Box } from "./types"
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
} from "./constants"
import { getQuantifierText } from "@/parser"
import { getTextsWithBacktick, getName } from "./utils"
const fontFamily = `-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji`
type TextSize = { width: number; height: number }
const textSizeMap = new Map<string, TextSize>()
const sizeWeakMap = new WeakMap<AST.Node, Size>()

class RenderEngine {
  private canvas: HTMLCanvasElement
  private context: CanvasRenderingContext2D | null
  private renderNodes: RenderNode[] = []
  private renderConnects: RenderConnect[] = []
  private layoutChildrenList: LayoutChildren[] = []
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

  public render(ast: AST.Regex, minimum = false) {
    this.renderNodes = []
    this.renderConnects = []
    this.layoutChildrenList = []
    const { body } = ast
    let { width, height } = this.calcNodesSize(body)
    const paddingHorizontal = minimum
      ? MINIMUM_CHART_PADDING_HORIZONTAL
      : CHART_PADDING_HORIZONTAL
    const paddingVertical = minimum
      ? MINIMUM_CHART_PADDING_VERTICAL
      : CHART_PADDING_VERTICAL

    this.renderChildren(body, {
      parentWidth: width,
      parentHeight: height,
      initialX: paddingHorizontal,
      initialY: paddingVertical,
    })
    return {
      width: width + 2 * paddingHorizontal,
      height: height + 2 * paddingHorizontal,
      nodes: this.renderNodes,
      connects: this.renderConnects,
    }
  }

  //     name
  // -------------
  // |   texts   |
  // -------------
  //   quantifier
  private calcNodeSize(node: AST.Node): Size {
    if (sizeWeakMap.has(node)) {
      return sizeWeakMap.get(node)!
    }

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
          this.calcNodesSize(nodes)
        height += branchHeight
        height += NODE_MARGIN_VERTICAL
        branchWidth +=
          NODE_MARGIN_HORIZONTAL * 2 + BRANCH_PADDING_HORIZONTAL * 2
        width = Math.max(width, branchWidth)
      })
    } else if (node.type === "group" || node.type === "lookAroundAssertion") {
      ;({ width, height } = this.calcNodesSize(node.children))
      height += 2 * NODE_MARGIN_VERTICAL
      width += NODE_MARGIN_HORIZONTAL * 2
    } else if (texts) {
      const size = this.measureTexts(texts, NODE_TEXT_FONTSIZE)
      width = size.width + 2 * NODE_PADDING_HORIZONTAL
      height = size.height + 2 * NODE_PADDING_VERTICAL
    } else if (node.type === "root") {
      width = ROOT_RADIUS
      height = ROOT_RADIUS
    } else {
      // empty node
      width = 2 * NODE_PADDING_HORIZONTAL
      height = NODE_TEXT_FONTSIZE + 2 * NODE_PADDING_VERTICAL
    }

    // quantifier times text
    if (
      (node.type === "character" || node.type === "group") &&
      node.quantifier
    ) {
      const { quantifier } = node
      paddingBottom += QUANTIFIER_HEIGHT

      const text = getQuantifierText(quantifier)
      if (text) {
        const quantifierWidth =
          this.measureText(text, QUANTIFIER_TEXT_FONTSIZE).width +
          QUANTIFIER_ICON_WIDTH +
          QUANTIFIER_ICON_MARGIN_RIGHT
        offsetWidth = Math.max(quantifierWidth, width, offsetWidth)
      }
    }

    // name
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
    sizeWeakMap.set(node, size)
    return size
  }

  private calcNodesSize(nodes: AST.Node[]) {
    let height = 0
    let width = 0
    nodes.forEach((node) => {
      const size = this.calcNodeSize(node)
      height = Math.max(height, size.offsetHeight)
      width += size.offsetWidth
    })

    width += NODE_MARGIN_HORIZONTAL * (nodes.length - 1)
    return { width, height }
  }

  renderChildren(
    nodes: AST.Node[],
    {
      parentWidth,
      parentHeight,
      initialX,
      initialY,
    }: {
      parentWidth: number
      parentHeight: number
      initialX: number
      initialY: number
    }
  ) {
    if (nodes.length === 0) {
      return
    }
    const { width } = this.calcNodesSize(nodes)
    const deltaX = (parentWidth - width) / 2
    const connectY = initialY + parentHeight / 2
    let x = initialX

    const layoutChildren: LayoutChildren = []
    this.layoutChildrenList.push(layoutChildren)

    const head = nodes[0]
    const tail = nodes[nodes.length - 1]

    let paddingLeft = 0
    let paddingRight = 0
    if (head.type !== "root") {
      const headSize = this.calcNodeSize(head)
      paddingLeft = (headSize.offsetWidth - headSize.width) / 2
      this.renderConnects.push({
        kind: "straight",
        id: nanoid(),
        start: { x, y: connectY },
        end: { x: (x += deltaX + paddingLeft), y: connectY },
      })
    }
    nodes.forEach((node, index) => {
      const size = this.calcNodeSize(node)
      paddingLeft = (size.offsetWidth - size.width) / 2
      if (index !== 0) {
        this.renderConnects.push({
          kind: "straight",
          id: nanoid(),
          start: { x, y: connectY },
          end: {
            x: (x += NODE_MARGIN_HORIZONTAL + paddingLeft + paddingRight),
            y: connectY,
          },
        })
      }
      this.renderSingleNode(node, {
        initialX: x,
        initialY: initialY + (parentHeight - size.height) / 2,
        width: size.width,
        height: size.height,
        layoutChildren,
      })

      x += size.width
      paddingRight = paddingLeft
    })
    if (tail.type !== "root") {
      this.renderConnects.push({
        kind: "straight",
        id: nanoid(),
        start: { x, y: connectY },
        end: { x: (x += deltaX + paddingRight), y: connectY },
      })
    }
  }

  private renderSingleNode(
    node: AST.Node,
    {
      initialX,
      initialY,
      width,
      height,
      layoutChildren,
    }: {
      initialX: number
      initialY: number
      width: number
      height: number
      layoutChildren: LayoutChildren
    }
  ) {
    const renderNode: RenderNode = {
      id: node.id,
      x: initialX,
      y: initialY,
      width,
      height,
      target: node,
    }
    this.renderNodes.push(renderNode)
    layoutChildren.push({
      id: node.id,
      x: initialX,
      y: initialY,
      width,
      height,
    })

    if (node.type === "group" || node.type === "lookAroundAssertion") {
      this.renderChildren(node.children, {
        parentWidth: width,
        parentHeight: height,
        initialX,
        initialY,
      })
    } else if (node.type === "choice") {
      const { branches } = node
      let x = initialX
      let y = initialY

      const padding = NODE_MARGIN_HORIZONTAL + BRANCH_PADDING_HORIZONTAL
      branches.forEach((branch) => {
        const branchHeight =
          this.calcNodesSize(branch).height + NODE_MARGIN_VERTICAL

        this.renderConnects.push({
          id: nanoid(),
          kind: "split",
          start: { x, y: initialY + height / 2 },
          end: {
            x: x + padding,
            y: y + branchHeight / 2,
          },
        })
        this.renderConnects.push({
          id: nanoid(),
          kind: "combine",
          start: { x: x + width - padding, y: y + branchHeight / 2 },
          end: { x: x + width, y: initialY + height / 2 },
        })
        if (branch.length > 0) {
          this.renderChildren(branch, {
            initialX: x + padding,
            initialY: y,
            parentWidth: width - 2 * padding,
            parentHeight: branchHeight,
          })
        } else {
          // like: /a|/
          this.renderConnects.push({
            id: nanoid(),
            kind: "straight",
            start: {
              x: x + padding,
              y: y + branchHeight / 2,
            },
            end: { x: x + width - padding, y: y + branchHeight / 2 },
          })
        }
        y += branchHeight
      })
    }
  }

  public measureText(text: string, fontSize: number = 16) {
    const context = this.context
    if (!context) {
      return { width: 0, height: 0 }
    }
    const textFont = fontSize + "px " + fontFamily
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

  public measureTexts(texts: string[] | string, fontSize: number = 16) {
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

  public selectByBound(box: Box) {
    let selected = false
    const selectedIds = []
    for (let i = 0; i < this.layoutChildrenList.length; i++) {
      const layoutChildren = this.layoutChildrenList[i]
      for (let j = 0; j < layoutChildren.length; j++) {
        const nodeLayout = layoutChildren[j]
        const { id, x, y, width, height } = nodeLayout
        const overlapX = box.x < x && box.x + box.width > x + width
        const overlapY = box.y < y && box.y + box.height > y + height
        if (overlapX && overlapY) {
          selected = true
          selectedIds.push(id)
        } else if (selected) {
          return selectedIds
        }
      }
    }
    return selectedIds
  }
}

const renderEngine = new RenderEngine()
export default renderEngine
