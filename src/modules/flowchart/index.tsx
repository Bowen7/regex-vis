import React, { useRef, useState, useEffect } from "react"
import { RootNode } from "@types"
import { RenderNode, RenderConnect, Box } from "./types"
import Traverse from "./traverse"
import FlowNode from "./flowNode"
import FlowConnect from "./flowConnect"
import SvgContainer from "./svgContainer"
import { useEventListener } from "../../utils/hooks"
type Props = {
  root: RootNode
  onSelect?: (ids: string[]) => void
  onRemove?: (ids: string[]) => void
}
const Flowchart: React.FC<Props> = props => {
  const { root, onRemove, onSelect } = props
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [traverse] = useState<Traverse>(new Traverse(canvasRef))
  const [width, setWidth] = useState(0)
  const [height, setHeight] = useState(0)
  const [renderNodes, setRenderNodes] = useState<RenderNode[]>([])
  const [renderConnects, setRenderConnects] = useState<RenderConnect[]>([])
  const [selectIds, setSelectIds] = useState<string[]>([])
  useEffect(() => {
    const { width, height, renderNodes, renderConnects } = traverse.t(root)
    setWidth(width)
    setHeight(height)
    setRenderNodes(renderNodes)
    setRenderConnects(renderConnects)
    setSelectIds([])
  }, [root, traverse])
  function onDragSelect(box: Box) {
    const { x: _x, y: _y, width: _width, height: _height } = box
    const renderNodes = traverse.renderNodes
    const chainIds = traverse.chainIds
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
    for (let i = 0; i < chainIds.length; i++) {
      if (chainIds[i].some(item => ids.indexOf(item) > -1)) {
        const selectIds = chainIds[i].filter(item => ids.indexOf(item) > -1)
        setSelectIds(selectIds)
        onSelect && onSelect(selectIds)
        break
      }
    }
  }
  function onClick(id: string) {
    let ids = [id]
    if (selectIds.length === 1 && selectIds.includes(id)) {
      ids = []
    }
    setSelectIds(ids)
    onSelect && onSelect(ids)
  }
  useEventListener("keydown", (e: Event) => {
    const { key } = e as KeyboardEvent
    if (key === "Backspace") {
      const ids: string[] = []
      setSelectIds(ids)
      onSelect && onSelect(ids)
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
              selected={selectIds.includes(id)}
              // onClick={onClick}
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
