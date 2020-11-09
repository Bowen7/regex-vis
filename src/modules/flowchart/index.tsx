import React, { useRef, useState, useEffect } from "react"
import { NodeMap } from "@types"
import { RenderNode, RenderConnect, Box } from "./types"
import Traverse from "./traverse"
import FlowNode from "./flowNode"
import FlowConnect from "./flowConnect"
import SvgContainer from "./svgContainer"
import { useEventListener } from "../../utils/hooks"
type Props = {
  nodeMap: NodeMap
  root: number
  onSelect?: (ids: Set<number>) => void
  onRemove?: (ids: Set<number>) => void
}
const Flowchart: React.FC<Props> = props => {
  const { nodeMap, root, onRemove, onSelect } = props
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [traverse] = useState<Traverse>(new Traverse(canvasRef))
  const [width, setWidth] = useState(0)
  const [height, setHeight] = useState(0)
  const [renderNodes, setRenderNodes] = useState<RenderNode[]>([])
  const [renderConnects, setRenderConnects] = useState<RenderConnect[]>([])
  const [selectIds, setSelectIds] = useState<Set<number>>(new Set())
  useEffect(() => {
    const { width, height, renderNodes, renderConnects } = traverse.t(
      nodeMap,
      root
    )
    setWidth(width)
    setHeight(height)
    setRenderNodes(renderNodes)
    setRenderConnects(renderConnects)
    setSelectIds(new Set())
  }, [nodeMap, root, traverse])
  function onDragSelect(box: Box) {
    const { x: _x, y: _y, width: _width, height: _height } = box
    const renderNodes = traverse.renderNodes
    const concatenations = traverse.concatenations
    const ids = renderNodes
      .filter(renderNode => {
        const { node, x, y, width, height } = renderNode
        if (node.type === "root") {
          return false
        }
        const overlapX = _x < x && _x + _width > x + width
        const overlapY = _y < y && _y + _height > y + height
        return overlapX && overlapY
      })
      .map(renderNode => renderNode.node.id)
    for (let i = 0; i < concatenations.length; i++) {
      if (concatenations[i].some(item => ids.indexOf(item) > -1)) {
        const selectIds = concatenations[i].filter(
          item => ids.indexOf(item) > -1
        )
        const newSelectIds = new Set(selectIds)
        setSelectIds(newSelectIds)
        onSelect && onSelect(newSelectIds)
        break
      }
    }
  }
  function onClick(id: number) {
    if (selectIds.size === 1 && selectIds.has(id)) {
      setSelectIds(new Set())
      return
    }
    setSelectIds(new Set([id]))
  }
  useEventListener("keydown", (e: Event) => {
    const { key } = e as KeyboardEvent
    if (key === "Backspace") {
      onRemove && onRemove(selectIds)
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
              selected={selectIds.has(id)}
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
