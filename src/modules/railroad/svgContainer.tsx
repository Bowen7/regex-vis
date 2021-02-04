import React, { useState, useRef } from "react"
import { useEventListener } from "../../utils/hooks"
import { RenderNode, RenderConnect, Box, RenderVirtualNode } from "@/types"
import { Node } from "@/types"
import RailNode from "./node"
import Connect from "./connect"
type Props = {
  width: number
  height: number
  rootRenderNode: RenderVirtualNode
  selectedNodes: Node[]
  onDragSelect?: (box: Box) => void
  onClick?: (node: Node) => void
}
const SvgContainer: React.FC<Props> = React.memo(props => {
  const {
    width,
    height,
    rootRenderNode,
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

  function displayRenderNodes() {
    const result: JSX.Element[] = []
    function dfs(renderNode: RenderNode | RenderVirtualNode | RenderConnect) {
      switch (renderNode.type) {
        case "connect": {
          const { start, end, id } = renderNode
          result.push(
            <Connect type={"split"} start={start} end={end} key={id} />
          )
          break
        }
        case "node": {
          const { id, x, y, width, height, target, children } = renderNode
          result.push(
            <RailNode
              x={x}
              y={y}
              width={width}
              height={height}
              node={target}
              selected={selectedNodes.includes(target)}
              onClick={handleClick}
              key={id}
            />
          )
          children.forEach(item => dfs(item))
          break
        }
        case "virtual": {
          const { children } = renderNode
          children.forEach(item => dfs(item))
          break
        }
        default:
          break
      }
    }
    dfs(rootRenderNode)
    return result
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
        {displayRenderNodes()}
        <rect
          x={rect.x}
          y={rect.y}
          width={rect.width}
          height={rect.height}
          fill="#3291FF"
          fillOpacity={0.5}
        ></rect>
      </svg>
      <style jsx>{`
        svg {
          border: 0.5px dashed #999;
          border-radius: 5px;
        }
      `}</style>
    </>
  )
})

export default SvgContainer
