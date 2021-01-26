import React, { useRef, useState, useEffect } from "react"
import { Node } from "@/types"
import { RenderNode, RenderConnect, Box } from "./types"
import Traverse from "./traverse"
import SvgContainer from "./svgContainer"
type Props = {
  nodes: Node[]
  selectedNodes: Node[]
  onSelect?: (nodes: Node[]) => void
}
const Flowchart: React.FC<Props> = props => {
  const { nodes, onSelect, selectedNodes } = props
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [traverse] = useState<Traverse>(new Traverse(canvasRef))
  const [width, setWidth] = useState(0)
  const [height, setHeight] = useState(0)
  const [renderNodes, setRenderNodes] = useState<RenderNode[]>([])
  const [renderConnects, setRenderConnects] = useState<RenderConnect[]>([])

  useEffect(() => {
    const { width, height, renderNodes, renderConnects } = traverse.t(nodes)
    setWidth(width)
    setHeight(height)
    setRenderNodes(renderNodes)
    setRenderConnects(renderConnects)
  }, [nodes, traverse])

  function onDragSelect(box: Box) {
    const { x: _x, y: _y, width: _width, height: _height } = box
    const renderNodes = traverse.renderNodes
    const chainNodes = traverse.chainNodes
    const nodes = renderNodes
      .filter(renderNode => {
        const { node, x, y, width, height } = renderNode
        if (node.type === "root") {
          return false
        }
        const overlapX = _x < x && _x + _width > x + width
        const overlapY = _y < y && _y + _height > y + height
        return overlapX && overlapY
      })
      .map(renderNode => renderNode.node)
    for (let i = 0; i < chainNodes.length; i++) {
      if (chainNodes[i].some(item => nodes.some(node => node === item))) {
        let selectedNodes = chainNodes[i].filter(item =>
          nodes.some(node => node === item)
        )
        onSelect && onSelect(selectedNodes)
        break
      }
    }
  }

  function onClick(node: Node) {
    let nodes = [node]
    if (selectedNodes.length === 1 && selectedNodes.includes(node)) {
      nodes = []
    }
    onSelect && onSelect(nodes)
  }
  return (
    <>
      <canvas
        ref={canvasRef}
        style={{ position: "absolute", top: "-9999px", left: "-9999px" }}
      ></canvas>
      <SvgContainer
        width={width}
        height={height}
        nodes={renderNodes}
        connects={renderConnects}
        selectedNodes={selectedNodes}
        onDragSelect={onDragSelect}
        onClick={onClick}
      ></SvgContainer>
    </>
  )
}

export default Flowchart
