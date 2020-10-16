import addSvg from "@assets/add.svg"
import { RootNode, Pos, Node, ChoiceNode } from "@types"
import { MIN_INTERVAL, SVG_PADDING_LEFT } from "./config"
import Raphael, { RaphaelPaper, RaphaelElement } from "raphael"
type Box = {
  x: number
  y: number
  width: number
  height: number
}
type RegexFlowConfigs = {
  origin: Pos
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
}
class RegexFlow {
  configs: RegexFlowConfigs
  paper: RaphaelPaper
  standardText: RaphaelElement | null = null
  root: RootNode
  nodeMap: Map<number, Node>
  preRenderElements: PreRender[] = []
  cachedSizeMap: Map<number, Size> = new Map()
  constructor(
    root: RootNode,
    nodeMap: Map<number, Node>,
    configs: RegexFlowConfigs
  ) {
    this.configs = configs
    const { origin, width, height } = this.configs
    const paper = Raphael(origin.x, origin.y, width, height)
    this.paper = paper
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
    this.traverseConcatenation(concatenation, 50, 0)
    this.renderElements()
  }
  renderElements() {
    this.preRenderElements.forEach(el => {
      const { x, y, width, height, id } = el
      new Rect(
        this.paper,
        {
          x,
          y,
          width,
          height,
        },
        `${id}${id}${id}`
      )
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
      width = this.measureTextWidth(node.body.text)
      height = 50
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
  traverseUnknownType(id: number, x: number, y: number) {
    const node = this.nodeMap.get(id) as Node
    if (node.type === "choice") {
      this.traverseChoice(id, x, y)
    } else if (node.type === "basic") {
      const size = this.getSize(id)
      this.preRenderElements.push({
        id,
        x,
        y,
        width: size.width,
        height: size.height,
      })
    }
  }
  traverseChoice(id: number, x: number, y: number) {
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
      const height = this.traverseConcatenation(concatenation, x + deltaX, y)
      y += height
    })
  }
  traverseConcatenation(concatenation: number[], x: number, y: number) {
    let height = 0
    concatenation.forEach(id => {
      const size = this.getSize(id)
      height = Math.max(height, size.height)
    })
    concatenation.forEach(id => {
      const size = this.getSize(id)
      const deltaY = (height - size.height) / 2
      this.traverseUnknownType(id, x, y + deltaY)
      x += size.width
    })
    return height
  }
  createStandardText() {
    this.standardText = this.paper.text(-9999, -9999, "")
  }
  measureTextWidth(text: string, fontSize: number = 12) {
    this.standardText?.attr({
      text,
      "font-size": fontSize,
    })
    const box = this.standardText?.getBBox()
    return box ? box.width : 0
  }
  insertBefore(): void {}
  insertAfter(): void {}
  remove(): void {}
}

class Circle {
  paper: RaphaelPaper
  elements: RaphaelElement[] = []
  constructor(paper: RaphaelPaper, box: Box, text: string) {
    this.paper = paper
    const { x, y, width, height } = box
    if (width !== height) {
      console.warn("This is a circle, the width should be equal to height")
    }
    const center = {
      x: x + width / 2,
      y: y + width / 2,
    }
    const circleEl = paper.circle(center.x, center.y, width / 2)
    const textEl = paper.text(center.x, center.y, text)
    this.elements.push(circleEl, textEl)
  }
}

class Rect {
  paper: RaphaelPaper
  elements: RaphaelElement[] = []
  constructor(paper: RaphaelPaper, box: Box, text: string) {
    this.paper = paper
    const { x, y, width, height } = box
    const rectEl = paper.rect(x, y, width, height)
    const center = {
      x: x + width / 2,
      y: y + height / 2,
    }
    const textEl = paper.text(center.x, center.y, text)
    this.elements.push(rectEl, textEl)
  }
}
export default RegexFlow
