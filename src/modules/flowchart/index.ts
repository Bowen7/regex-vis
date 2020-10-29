import addSvg from "@assets/add.svg"
import { NodeMap } from "@types"
import Svgx, { SvgxG } from "../svgx"
import FlowNode from "./node"
import { RenderNode, RenderConnect } from "./types"
import Connect from "./connect"
import Traverse from "./traverse"
class RegexFlow {
  svgx: Svgx
  lineG!: SvgxG
  root: number
  traverser!: Traverse
  constructor(selectorQuery: string, root: number) {
    this.svgx = new Svgx(selectorQuery)
    this.root = root
    this.traverser = new Traverse(this.svgx)
  }
  render(nodeMap: NodeMap): void {
    const { root } = this

    this.clear()
    this.lineG = this.svgx.g()

    const { width, height, renderNodes, renderConnects } = this.traverser.t(
      nodeMap,
      root
    )

    this.svgx.setSize(width, height)
    this.renderSvg(renderNodes, renderConnects)
  }
  clear() {
    this.svgx.target.innerHTML = ""
  }
  renderSvg(renderNodes: RenderNode[], renderConnects: RenderConnect[]) {
    renderNodes.forEach(el => {
      const { x, y, width, height, text, id, type, quantifier } = el
      new FlowNode(this.svgx, {
        box: {
          x,
          y,
          width,
          height,
        },
        text,
        id,
        handlers: {},
        type,
        quantifier,
      })
    })
    renderConnects.forEach(({ start, end, type }) => {
      new Connect(this.lineG, start, end, type)
    })
  }
}
export default RegexFlow
