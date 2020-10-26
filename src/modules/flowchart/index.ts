import addSvg from "@assets/add.svg"
import { RootNode, Pos, Node, ChoiceNode, GroupNode } from "@types"
import {
  FLOWCHART_PADDING_HORIZONTAL,
  FLOWCHART_PADDING_VERTICAL,
  FLOW_NODE_PADDING_HORIZONTAL,
  FLOW_NODE_PADDING_VERTICAL,
  FLOW_NODE_BORDER_RADIUS,
  FLOW_NODE_MARGIN_VERTICAL,
  FLOW_NODE_MARGIN_HORIZONTAL,
  FLOW_CHOICE_PADDING_HORIZONTAL,
} from "./config"
import Svgx, { SvgxElement, SvgxG } from "../svgx"
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
type RenderNode = {
  id: number
  x: number
  y: number
  width: number
  height: number
  text: string
}
type RenderLine = {
  type: "combine" | "split" | "straight"
  start: Pos
  end: Pos
}
let id_seed = 8
class RegexFlow {
  svgx: Svgx
  lineG!: SvgxG
  standardText: SvgxElement | null = null
  root: number
  nodeMap: Map<number, Node>
  preRenderNodes: RenderNode[] = []
  preRenderLines: RenderLine[] = []
  cachedSizeMap: Map<number, Size> = new Map()
  constructor(selectorQuery: string, root: number, nodeMap: Map<number, Node>) {
    this.svgx = new Svgx(selectorQuery)
    this.root = root
    this.nodeMap = nodeMap
  }
  render(): void {
    const { root, nodeMap } = this
    let cur: RootNode | null | number = root
    const concatenation: number[] = []

    this.lineG = this.svgx.g()
    this.createStandardText()
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
      FLOWCHART_PADDING_HORIZONTAL,
      FLOWCHART_PADDING_VERTICAL
    )
    width += FLOWCHART_PADDING_HORIZONTAL * 2
    height += FLOWCHART_PADDING_VERTICAL * 2
    this.svgx.setSize(width, height)
    this.renderElements()
  }
  add(id: number, direction: "prev" | "next") {
    if (direction === "prev") {
      const node = this.nodeMap.get(id) as Node
      const prevId = node.prev as number
      const prevNode = this.nodeMap.get(prevId) as Node

      node.prev = id_seed
      if (prevNode.type === "basic") {
        prevNode.next = id_seed
      } else if (prevNode.type === "choice") {
        prevNode.branches = prevNode.branches.map(branch =>
          branch === id ? id_seed : branch
        )
      }

      this.nodeMap.set(id_seed, {
        type: "basic",
        id: id_seed,
        body: {
          type: "simple",
          value: "555",
          text: "44",
        },
        prev: prevId,
        next: id,
      })
      id_seed++
    } else {
    }

    this.clear()
    this.cachedSizeMap = new Map()
    this.render()
  }
  clear() {
    this.svgx.target.innerHTML = ""
  }
  renderElements() {
    this.preRenderNodes.forEach(el => {
      const { x, y, width, height, text, id } = el
      new Rect(
        this.svgx,
        {
          x,
          y,
          width,
          height,
        },
        text,
        id,
        { add: this.add.bind(this) }
      )
    })
    this.preRenderLines.forEach(({ start, end, type }) => {
      new Line(this.lineG, start, end, type)
    })
    this.preRenderLines = []
    this.preRenderNodes = []
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
    if (node.type === "basic" || node.type === "root") {
      let text = ""
      if (node.type === "basic") {
        text = node.body.text
      } else {
        text = node.text
      }
      const size = this.measureText(text)

      width = size.width + 2 * FLOW_NODE_PADDING_HORIZONTAL
      height = size.height + 2 * FLOW_NODE_PADDING_VERTICAL
    } else if (node.type === "choice") {
      const { branches } = node
      branches.forEach((branch, index) => {
        let _width = 0
        let _height = 0
        let cur = branch
        while (cur !== id) {
          const size = this.getSize(cur)
          _width += size.width + FLOW_NODE_MARGIN_HORIZONTAL
          _height = Math.max(size.height, _height)
          const nextNode = this.nodeMap.get(cur) as Node
          cur = nextNode.next as number
        }
        height += _height
        index > 0 && (height += FLOW_NODE_MARGIN_VERTICAL)
        width = Math.max(width, _width)
      })
      width += FLOW_CHOICE_PADDING_HORIZONTAL * 2
    } else if (node.type === "group") {
      const { head } = node
      let cur = head
      while (cur !== id) {
        console.log(cur)
        const size = this.getSize(cur)
        width += size.width
        height = Math.max(size.height, height)
        const curNode = this.nodeMap.get(cur) as Node
        cur = curNode.next as number
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
    } else if (node.type === "group") {
      this.traverseGroup(id, x, y, connectPoint)
    } else if (node.type === "basic" || node.type === "root") {
      const size = this.getSize(id)

      let text = ""
      if (node.type === "basic") {
        const { body } = node
        if (body.type === "simple") {
          text = body.text
        }
      } else {
        text = node.text
      }
      this.preRenderNodes.push({
        id,
        x,
        y,
        width: size.width,
        height: size.height,
        text,
      })
    }
  }
  traverseGroup(id: number, x: number, y: number, connectPoint?: Pos) {
    const node = this.nodeMap.get(id) as GroupNode
    const groupSize = this.getSize(id)
    const { head } = node
    const concatenation: number[] = []
    let cur = head
    // let width = 0
    while (cur !== id) {
      concatenation.push(cur)
      // width += this.getSize(cur).width
      const curNode = this.nodeMap.get(cur) as Node
      cur = curNode.next as number
    }
    this.preRenderNodes.push({
      id,
      x,
      y,
      width: groupSize.width,
      height: groupSize.height,
      text: "",
    })
    this.traverseConcatenation(concatenation, x, y, connectPoint)
  }
  traverseChoice(id: number, x: number, y: number, endPoint?: Pos) {
    const node = this.nodeMap.get(id) as ChoiceNode
    const originY = y
    const { branches } = node
    const choiceSize = this.getSize(id)
    const maxWidth = choiceSize.width
    const branchEndPoints: Pos[] = []

    branches.forEach((branch, index) => {
      index > 0 && (y += FLOW_NODE_MARGIN_VERTICAL)
      let width = 0
      let cur = branch
      const concatenation: number[] = []
      while (cur !== id) {
        concatenation.push(cur)
        width += this.getSize(cur).width
        if (cur !== branch) {
          width += FLOW_NODE_MARGIN_HORIZONTAL
        }
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
      branchEndPoints.push({
        x: x + deltaX + width,
        y: y + height / 2,
      })
      this.preRenderLines.push({
        start: { x: x, y: originY + choiceSize.height / 2 },
        end: { x: x + deltaX, y: y + height / 2 },
        type: "split",
      })
      y += height
    })
    branchEndPoints.forEach(branchEndPoint => {
      this.preRenderLines.push({
        start: { ...branchEndPoint },
        end: { x: x + choiceSize.width, y: y - choiceSize.height / 2 },
        type: "combine",
      })
    })
  }
  traverseConcatenation(
    concatenation: number[],
    x: number,
    y: number,
    xx?: Pos
  ): Size {
    const originX = x
    let height = 0
    let connectPoint: Pos
    concatenation.forEach(id => {
      const size = this.getSize(id)
      height = Math.max(height, size.height)
    })
    concatenation.forEach(id => {
      const size = this.getSize(id)
      const node = this.nodeMap.get(id) as Node
      const deltaY = (height - size.height) / 2
      this.traverseUnknownType(id, x, y + deltaY, xx)

      if (connectPoint) {
        this.preRenderLines.push({
          type: "straight",
          start: { ...connectPoint },
          end: {
            x,
            y: y + height / 2,
          },
        })
      }
      connectPoint = {
        x: x + size.width,
        y: y + height / 2,
      }
      x += size.width + FLOW_NODE_MARGIN_HORIZONTAL
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

type RectHandlers = {
  add: (id: number, direction: "prev" | "next") => void
}
class Rect {
  svgx: Svgx
  g: SvgxG
  id: number
  constructor(
    svgx: Svgx,
    box: Box,
    text: string,
    id: number,
    handler?: RectHandlers
  ) {
    this.svgx = svgx
    this.id = id
    const { x, y, width, height } = box
    this.g = svgx.g()
    this.g.rect(x, y, width, height, FLOW_NODE_BORDER_RADIUS).attr({
      fill: "transparent",
    })

    const center = {
      x: x + width / 2,
      y: y + height / 2,
    }

    if (text) {
      this.g.text(center.x, center.y, text).attr({
        "font-size": 16,
      })
    }

    // let tmpEls: SvgxElement[] = []
    // const addHandler = handler && handler.add
    // this.g.enter(e => {
    //   const rect1 = this.g.rect(x - 21.5, y, 21.5, height).attr({
    //     stroke: "none",
    //     fill: "transparent",
    //   })
    //   const rect2 = this.g.rect(x + width, y, 21.5, height).attr({
    //     stroke: "none",
    //     fill: "transparent",
    //   })
    //   const image1 = this.g.image(addSvg, x - 21.5, y + height / 2 - 10, 20, 20)
    //   const image2 = this.g.image(
    //     addSvg,
    //     x + width + 1.5,
    //     y + height / 2 - 10,
    //     20,
    //     20
    //   )
    //   image1.click(() => {
    //     addHandler && addHandler(id, "prev")
    //   })
    //   image2.click(() => {
    //     addHandler && addHandler(id, "next")
    //   })
    //   tmpEls = [rect1, rect2, image1, image2]
    // })
    // this.g.leave(() => {
    //   tmpEls.forEach(tmpEl => tmpEl.remove())
    //   tmpEls = []
    // })
  }
}

class Line {
  g: SvgxG
  elements: SvgxElement[] = []
  constructor(
    g: SvgxG,
    start: Pos,
    end: Pos,
    type: "combine" | "split" | "straight"
  ) {
    this.g = g
    if (type === "straight" || Math.abs(start.y - end.y) < 0.5) {
      console.log(start, end)
      this.g.path(`M${start.x},${start.y}L${end.x},${end.y}`)
      return
    }

    let M = ""
    let L1 = ""
    let A1 = ""
    let L2 = ""
    let A2 = ""
    let L3 = ""
    if (type === "split") {
      M = `M${start.x},${start.y}`
      L1 = `L${start.x + 10},${start.y}`
      L3 = `L${end.x},${end.y}`
      if (end.y > start.y) {
        A1 = `A5 5 0 0 1, ${start.x + 15},${start.y + 5}`
        L2 = `L${start.x + 15},${end.y - 5}`
        A2 = `A5 5 0 0 0, ${start.x + 20},${end.y}`
      } else {
        A1 = `A5 5 0 0 0, ${start.x + 15},${start.y - 5}`
        L2 = `L${start.x + 15},${end.y + 5}`
        A2 = `A5 5 0 0 1, ${start.x + 20},${end.y}`
      }
    }
    if (type === "combine") {
      M = `M${end.x},${end.y}`
      L1 = `L${end.x - 10},${end.y}`
      L3 = `L${start.x},${start.y}`
      if (end.y > start.y) {
        A1 = `A5 5 0 0 1, ${end.x - 15},${end.y - 5}`
        L2 = `L${end.x - 15},${start.y + 5}`
        A2 = `A5 5 0 0 0, ${end.x - 20},${start.y}`
      } else {
        A1 = `A5 5 0 0 0, ${end.x - 15},${end.y + 5}`
        L2 = `L${end.x - 15},${start.y - 5}`
        A2 = `A5 5 0 0 1, ${end.x - 20},${start.y}`
      }
    }
    this.g.path(M + L1 + A1 + L2 + A2 + L3)
  }
}
export default RegexFlow
