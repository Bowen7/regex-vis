import React, { useRef, useState, useEffect } from "react"
import { RootNode, Node } from "@types"
import { RenderNode, RenderConnect, Box } from "./types"
import Traverse from "./traverse"
import FlowNode from "./flowNode"
import FlowConnect from "./flowConnect"
import SvgContainer from "./svgContainer"
import { useEventListener } from "../../utils/hooks"
type Props = {
  root: RootNode
  onSelect?: (ids: Node[]) => void
  onRemove?: (ids: Node[]) => void
}
const Flowchart: React.FC<Props> = props => {
  const { root, onRemove, onSelect } = props
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [traverse] = useState<Traverse>(new Traverse(canvasRef))
  const [width, setWidth] = useState(0)
  const [height, setHeight] = useState(0)
  const [renderNodes, setRenderNodes] = useState<RenderNode[]>([])
  const [renderConnects, setRenderConnects] = useState<RenderConnect[]>([])
  const [selectNodes, setSelectNodes] = useState<Node[]>([])
  useEffect(() => {
    const { width, height, renderNodes, renderConnects } = traverse.t(root)
    setWidth(width)
    setHeight(height)
    setRenderNodes(renderNodes)
    setRenderConnects(renderConnects)
    setSelectNodes([])
  }, [root, traverse])
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
        const selectNodes = chainNodes[i].filter(item =>
          nodes.some(node => node === item)
        )
        setSelectNodes(selectNodes)
        onSelect && onSelect(selectNodes)
        break
      }
    }
  }
  function onClick(node: Node) {
    let nodes = [node]
    if (selectNodes.length === 1 && selectNodes.includes(node)) {
      nodes = []
    }
    setSelectNodes(nodes)
    onSelect && onSelect(nodes)
  }
  useEventListener("keydown", (e: Event) => {
    const { key } = e as KeyboardEvent
    if (key === "Backspace") {
      const nodes: Node[] = []
      setSelectNodes(nodes)
      onSelect && onSelect(nodes)
      onRemove && onRemove(selectNodes)
    }
  })
  return (
    <>
      <canvas
        ref={canvasRef}
        style={{ position: "absolute", top: "-9999px", left: "-9999px" }}
      ></canvas>
      <SvgContainer width={width} height={height} onDragSelect={onDragSelect}>
        {renderNodes.map(renderNode => {
          const { x, y, width, height, node } = renderNode
          const { id } = node
          return (
            <FlowNode
              x={x}
              y={y}
              width={width}
              height={height}
              node={node}
              selected={selectNodes.includes(node)}
              onClick={onClick}
              key={id}
            />
          )
        })}
        {renderConnects.map(renderConnect => {
          const { type, start, end, id } = renderConnect
          return <FlowConnect type={type} start={start} end={end} key={id} />
        })}
      </SvgContainer>
    </>
  )
}

export default Flowchart
