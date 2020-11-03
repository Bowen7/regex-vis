import addSvg from "@assets/add.svg"
import { NodeMap } from "@types"
import Svgx, { SvgxG } from "../svgx"
import FlowNode from "./node"
import { RenderNode, RenderConnect, Box } from "./types"
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
  flowNodeMap: Map<number, FlowNode> = new Map()
  constructor(selectorQuery: string, root: number) {
    this.svgx = new Svgx(selectorQuery)
    this.root = root
    this.traverser = new Traverse(this.svgx)
    this.handler = new Handler()
    this.svgx.onSelect((box: Box) => {
      const { x: _x, y: _y, width: _width, height: _height } = box
      const renderNodes = this.traverser.renderNodes
      const concatenations = this.traverser.concatenations
      const ids = renderNodes
        .filter(renderNode => {
          const { type, x, y, width, height } = renderNode
          if (type === "root") {
            return false
          }
          const overlapX = _x < x && _x + _width > x + width
          const overlapY = _y < y && _y + _height > y + height
          return overlapX && overlapY
        })
        .map(renderNode => renderNode.id)
      let selectedIds: number[] = []
      for (let i = 0; i < concatenations.length; i++) {
        if (concatenations[i].some(item => ids.indexOf(item) > -1)) {
          selectedIds = concatenations[i].filter(item => ids.indexOf(item) > -1)
          break
        }
      }
      selectedIds.forEach(id => {
        const flowNode = this.flowNodeMap.get(id) as FlowNode
        flowNode.select()
      })
    })
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
    this.flowNodeMap = new Map()
    renderNodes.forEach(el => {
      const { x, y, width, height, text, id, type, quantifier } = el
      const flowNode = new FlowNode(this.svgx, {
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
      this.flowNodeMap.set(id, flowNode)
    })
    renderConnects.forEach(({ start, end, type }) => {
      new Connect(this.lineG, start, end, type)
    })
  }
}
export default RegexFlow
