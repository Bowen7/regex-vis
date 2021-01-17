import React, { useState, useRef } from "react"
import { Box } from "./types"
import { useEventListener } from "../../utils/hooks"
import { RenderNode, RenderConnect } from "./types"
import { Node } from "@/types"
import RailNode from "./node"
import Connect from "./connect"
type Props = {
  width: number
  height: number
  nodes: RenderNode[]
  connects: RenderConnect[]
  selectedNodes: Node[]
  onDragSelect?: (box: Box) => void
  onClick?: (node: Node) => void
}
const SvgContainer: React.FC<Props> = React.memo(props => {
  const {
    width,
    height,
    nodes,
    connects,
    onDragSelect,
    selectedNodes,
    onClick,
  } = props
  const dragging = useRef<boolean>(false)
  const moving = useRef<boolean>(false)
  const startX = useRef<number>(0)
  const startY = useRef<number>(0)
  const endX = useRef<number>(0)
  const endY = useRef<number>(0)
  const [rect, setRect] = useState<Box>({ x: 0, y: 0, width: 0, height: 0 })
  function onMouseDown(e: React.MouseEvent<SVGSVGElement>) {
    const { offsetX, offsetY } = e.nativeEvent
    dragging.current = true
    startX.current = offsetX
    startY.current = offsetY
  }
  function onMouseMove(e: React.MouseEvent<SVGSVGElement>) {
    if (!dragging.current) {
      return
    }
    moving.current = true
    const { offsetX, offsetY } = e.nativeEvent
    endX.current = offsetX
    endY.current = offsetY
    const x = offsetX > startX.current ? startX.current : offsetX
    const y = offsetY > startY.current ? startY.current : offsetY
    const width = Math.abs(offsetX - startX.current)
    const height = Math.abs(offsetY - startY.current)
    setRect({
      x,
      y,
      width,
      height,
    })
  }
  function onMouseUp(e: Event) {
    if (!dragging.current) {
      return
    }
    // should execute onMouseMove at least once
    if (!moving.current) {
      dragging.current = false
      return
    }
    const offsetX = endX.current
    const offsetY = endY.current
    const x = offsetX > startX.current ? startX.current : offsetX
    const y = offsetY > startY.current ? startY.current : offsetY
    const width = Math.abs(offsetX - startX.current)
    const height = Math.abs(offsetY - startY.current)
    if (width > 5 && height > 5) {
      // prevent click event on node
      window.addEventListener("click", captureClick, true)
      onDragSelect && onDragSelect({ x, y, width, height })
    }
    dragging.current = false
    moving.current = false
    setRect({ x: 0, y: 0, width: 0, height: 0 })
  }
  function handleClick(node: Node) {
    if (!moving.current) {
      onClick && onClick(node)
    }
  }

  function captureClick(e: MouseEvent) {
    e.stopPropagation()
    window.removeEventListener("click", captureClick, true)
  }

  useEventListener("mouseup", onMouseUp)
  return (
    <>
      <svg
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        width={width}
        height={height}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
      >
        {nodes.map(renderNode => {
          const { x, y, width, height, node } = renderNode
          const { id } = node
          return (
            <RailNode
              x={x}
              y={y}
              width={width}
              height={height}
              node={node}
              selected={selectedNodes.includes(node)}
              onClick={handleClick}
              key={id}
            />
          )
        })}
        {connects.map(connect => {
          const { type, start, end, id } = connect
          return <Connect type={type} start={start} end={end} key={id} />
        })}
        <rect
          x={rect.x}
          y={rect.y}
          width={rect.width}
          height={rect.height}
          fill="#50E3C2"
          fillOpacity={0.5}
        ></rect>
      </svg>
      <style jsx>{`
        svg {
          border: 0.5px solid #999;
          border-radius: 5px;
        }
      `}</style>
    </>
  )
})

export default SvgContainer
