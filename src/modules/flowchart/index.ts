import addSvg from "@assets/add.svg"
import { NodeMap } from "@types"
import Svgx, { SvgxG } from "../svgx"
import FlowNode from "./node"
import { RenderNode, RenderConnect } from "./types"
import Connect from "./connect"
import Traverse from "./traverse"
import Handler from "./handler"
class RegexFlow {
  svgx: Svgx
  lineG!: SvgxG
  nodeMap!: NodeMap
  root: number
  traverser: Traverse
  handler: Handler
  constructor(selectorQuery: string, root: number) {
    this.svgx = new Svgx(selectorQuery)
    this.root = root
    this.traverser = new Traverse(this.svgx)
    this.handler = new Handler()
  }
  render(nodeMap?: NodeMap): void {
    if (nodeMap) {
      this.nodeMap = nodeMap
    }

    this.clear()
    this.lineG = this.svgx.g()

    const { width, height, renderNodes, renderConnects } = this.traverser.t(
      this.nodeMap,
      this.root
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
        handler: this.handler.h(),
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
