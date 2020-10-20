import addSvg from "@assets/add.svg"
import { RootNode, Pos, Node, ChoiceNode } from "@types"
import {
  FLOWCHART_PADDING_LEFT,
  FLOWCHART_PADDING_TOP,
  FLOW_NODE_PADDING_LEFT,
  FLOW_NODE_PADDING_TOP,
  FLOW_NODE_BORDER_RADIUS,
  FLOW_NODE_MARGIN_TOP,
  FLOW_NODE_MARGIN_LEFT,
} from "./config"
import Svgx, { SvgxElement } from "../svgx"
type Box = {
  x: number
  y: number
  width: number
  height: number
}
type Size = {
  width: number
  height: number
}
type PreRender = {
  id: number
  x: number
  y: number
  width: number
  height: number
  text: string
  connectPoint?: Pos
}
class RegexFlow {
  svgx: Svgx
  standardText: SvgxElement | null = null
  root: RootNode
  nodeMap: Map<number, Node>
  preRenderElements: PreRender[] = []
  cachedSizeMap: Map<number, Size> = new Map()
  constructor(
    selectorQuery: string,
    root: RootNode,
    nodeMap: Map<number, Node>
  ) {
    this.svgx = new Svgx(selectorQuery)
    this.root = root
    this.nodeMap = nodeMap

    this.createStandardText()
  }
  render(): void {
    const { root, nodeMap } = this
    let cur: RootNode | null | number = root
    const concatenation: number[] = []
    while (cur !== null) {
      let curNode: Node | RootNode
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
      FLOWCHART_PADDING_LEFT,
      FLOWCHART_PADDING_TOP
    )
    width += FLOWCHART_PADDING_LEFT
    height += FLOWCHART_PADDING_TOP
    this.svgx.setSize(width, height)
    this.renderElements()
  }
  renderElements() {
    this.preRenderElements.forEach(el => {
      const { x, y, width, height, connectPoint, text } = el
      const actualX = x + FLOW_NODE_MARGIN_LEFT
      const actualY = y + FLOW_NODE_MARGIN_TOP
      const actualWidth = width - FLOW_NODE_MARGIN_LEFT * 2
      const actualHeight = height - FLOW_NODE_MARGIN_TOP * 2
      new Rect(
        this.svgx,
        {
          x: actualX,
          y: actualY,
          width: actualWidth,
          height: actualHeight,
        },
        text
      )

      if (connectPoint) {
        const endPoint = {
          x: x + FLOW_NODE_MARGIN_LEFT,
          y: y + height / 2,
        }
        new Line(this.svgx, connectPoint, endPoint)
      }
    })
  }
  // get single node size
  getSize(id: number) {
    const cachedSize = this.cachedSizeMap.get(id)
    if (cachedSize) {
      return cachedSize
    }
    const node = this.nodeMap.get(id) as Node
    let width = 0
    let height = 0
    if (node.type === "basic") {
      width =
        this.measureText(node.body.text).width +
        2 * FLOW_NODE_PADDING_LEFT +
        2 * FLOW_NODE_MARGIN_LEFT
      height =
        this.measureText(node.body.text).height +
        2 * FLOW_NODE_PADDING_TOP +
        2 * FLOW_NODE_MARGIN_LEFT
    } else if (node.type === "choice") {
      const { branches } = node
      branches.forEach(branch => {
        let _width = 0
        let _height = 0
        let cur = branch
        while (cur !== id) {
          const size = this.getSize(cur)
          _width += size.width
          _height = Math.max(size.height, _height)
          const nextNode = this.nodeMap.get(cur) as Node
          cur = nextNode.next as number
        }
        height += _height
        width = Math.max(width, _width)
      })
    } else if (node.type === "group") {
      const { head } = node
      let cur = head
      while (cur !== id) {
        const size = this.getSize(cur)
        width += size.width
        height = Math.max(size.height, height)
        const curNode = this.nodeMap.get(cur) as Node
        cur = curNode.id
      }
    }
    const size: Size = {
      width,
      height,
    }
    this.cachedSizeMap.set(id, size)
    return size
  }
  traverseUnknownType(id: number, x: number, y: number, connectPoint?: Pos) {
    const node = this.nodeMap.get(id) as Node
    if (node.type === "choice") {
      this.traverseChoice(id, x, y, connectPoint)
    } else if (node.type === "basic") {
      const { body } = node
      const size = this.getSize(id)
      let text = ""
      if (body.type === "simple") {
        text = body.text
      }
      this.preRenderElements.push({
        id,
        x,
        y,
        width: size.width,
        height: size.height,
        text,
        connectPoint,
      })
    }
  }
  traverseChoice(id: number, x: number, y: number, endPoint?: Pos) {
    const node = this.nodeMap.get(id) as ChoiceNode
    const { branches } = node
    const maxWidth = this.getSize(id).width
    branches.forEach(branch => {
      let width = 0
      let cur = branch
      const concatenation: number[] = []
      while (cur !== id) {
        concatenation.push(cur)
        width += this.getSize(cur).width
        const curNode = this.nodeMap.get(cur) as Node
        cur = curNode.next as number
      }
      const deltaX = (maxWidth - width) / 2
      const height = this.traverseConcatenation(
        concatenation,
        x + deltaX,
        y,
        endPoint
      ).height
      y += height
    })
  }
  traverseConcatenation(
    concatenation: number[],
    x: number,
    y: number,
    connectPoint?: Pos
  ): Size {
    const originX = x
    let height = 0
    concatenation.forEach(id => {
      const size = this.getSize(id)
      height = Math.max(height, size.height)
    })
    concatenation.forEach(id => {
      const size = this.getSize(id)
      const deltaY = (height - size.height) / 2
      this.traverseUnknownType(id, x, y + deltaY, connectPoint)
      x += size.width
      connectPoint = {
        x: x - FLOW_NODE_MARGIN_LEFT,
        y: y + height / 2,
      }
    })
    return { width: x - originX, height }
  }
  createStandardText() {
    this.standardText = this.svgx.text(-9999, -9999, "")
  }
  measureText(text: string, fontSize: number = 16) {
    this.standardText?.attr({
      text,
      "font-size": fontSize,
    })
    const box = this.standardText?.getBBox()
    return { width: box ? box.width : 0, height: box ? box.height : 0 }
  }
  insertBefore(): void {}
  insertAfter(): void {}
  remove(): void {}
}

class Circle {
  svgx: Svgx
  elements: SvgxElement[] = []
  constructor(svgx: Svgx, box: Box, text: string) {
    this.svgx = svgx
    const { x, y, width, height } = box
    if (width !== height) {
      console.warn("This is a circle, the width should be equal to height")
    }
    const center = {
      x: x + width / 2,
      y: y + width / 2,
    }
    const circleEl = svgx.circle(center.x, center.y, width / 2)
    const textEl = svgx.text(center.x, center.y, text)
    this.elements.push(circleEl, textEl)
  }
}

class Rect {
  svgx: Svgx
  elements: SvgxElement[] = []
  images: SvgxElement[] = []
  constructor(svgx: Svgx, box: Box, text: string) {
    this.svgx = svgx
    const { x, y, width, height } = box
    const g = svgx.g()
    const rectEl = g.rect(x, y, width, height, FLOW_NODE_BORDER_RADIUS)
    const center = {
      x: x + width / 2,
      y: y + height / 2,
    }
    const textEl = g.text(center.x, center.y, text).attr({
      "font-size": 16,
    })
    this.elements.push(rectEl, textEl)
  }
}

class Line {
  svgx: Svgx
  elements: SvgxElement[] = []
  constructor(svgx: Svgx, start: Pos, end: Pos) {
    this.svgx = svgx
    const M = `M${start.x},${start.y}`
    const L1 = `L${start.x + 10},${start.y}`
    const A1 =
      end.y > start.y
        ? `A5 5 0 0 1, ${start.x + 15},${start.y + 5}`
        : `A5 5 0 0 0, ${start.x + 15},${start.y - 5}`
    const L2 =
      end.y > start.y
        ? `L${start.x + 15},${end.y - 5} `
        : `L${start.x + 15},${end.y + 5} `
    const A2 =
      end.y > start.y
        ? `A5 5 0 0 0, ${start.x + 20},${end.y}`
        : `A5 5 0 0 1, ${start.x + 20},${end.y}`
    const L3 = `L${end.x},${end.y}`
    this.svgx.path(M + L1 + A1 + L2 + A2 + L3)
  }
}
export default RegexFlow
