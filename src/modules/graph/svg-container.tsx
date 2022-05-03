import React, { useState, useRef, useCallback, useMemo } from "react"
import { useEvent } from "react-use"
import { RenderNode, RenderConnect, Box } from "./types"
import { AST } from "@/parser"
import { dispatchSelectNodes } from "@/atom"
import RailNode from "./node"
import Connect from "./connect"
type Props = {
  width: number
  height: number
  connects: RenderConnect[]
  nodes: RenderNode[]
  selectedIds: string[]
  minimum: boolean
  onDragSelect?: (box: Box) => void
}
const SvgContainer: React.FC<Props> = (props) => {
  const { width, height, connects, nodes, selectedIds, minimum, onDragSelect } =
    props
  const dragging = useRef<boolean>(false)
  const moving = useRef<boolean>(false)
  const startX = useRef<number>(0)
  const startY = useRef<number>(0)
  const endX = useRef<number>(0)
  const endY = useRef<number>(0)
  const [rect, setRect] = useState<Box>({ x: 0, y: 0, width: 0, height: 0 })

  const selectedIdSet = useMemo(() => new Set(selectedIds), [selectedIds])

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

  const handleClick = useCallback((node: AST.Node) => {
    if (!moving.current) {
      dispatchSelectNodes(node.id)
    }
  }, [])

  function captureClick(e: MouseEvent) {
    e.stopPropagation()
    window.removeEventListener("click", captureClick, true)
  }
  useEvent("mouseup", onMouseUp)
  return (
    <svg
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      onMouseDown={minimum ? undefined : onMouseDown}
      onMouseMove={minimum ? undefined : onMouseMove}
      data-testid="graph"
    >
      {connects.map(({ kind, start, end, id }) => (
        <Connect kind={kind} start={start} end={end} key={id} />
      ))}
      {nodes.map(({ x, y, width, height, target, id }) => (
        <RailNode
          x={x}
          y={y}
          width={width}
          height={height}
          node={target}
          selected={selectedIdSet.has(id)}
          onClick={minimum ? undefined : handleClick}
          key={id}
        />
      ))}
      {!minimum && (
        <rect
          x={rect.x}
          y={rect.y}
          width={rect.width}
          height={rect.height}
          className="box-fill"
          fillOpacity={0.5}
        ></rect>
      )}
    </svg>
  )
}

export default SvgContainer
