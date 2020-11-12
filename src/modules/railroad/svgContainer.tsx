import React, { useState, useRef } from "react"
import { Box } from "./types"
import { useEventListener } from "../../utils/hooks"
import styled from "styled-components"
type Props = {
  width: number
  height: number
  onDragSelect?: (box: Box) => void
}
const Svg = styled.svg`
  border: 0.5px solid #999;
  border-radius: 5px;
`
const SvgContainer: React.FC<Props> = React.memo(props => {
  const { width, height, children, onDragSelect } = props
  const draging = useRef<boolean>(false)
  const moving = useRef<boolean>(false)
  const startX = useRef<number>(0)
  const startY = useRef<number>(0)
  const endX = useRef<number>(0)
  const endY = useRef<number>(0)
  const [rect, setRect] = useState<Box>({ x: 0, y: 0, width: 0, height: 0 })
  function onMouseDown(e: React.MouseEvent<SVGSVGElement>) {
    const { offsetX, offsetY } = e.nativeEvent
    draging.current = true
    startX.current = offsetX
    startY.current = offsetY
  }
  function onMouseMove(e: React.MouseEvent<SVGSVGElement>) {
    if (!draging.current) {
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
  function onMouseUp() {
    if (!draging.current) {
      return
    }
    if (!moving.current) {
      draging.current = false
      return
    }
    const offsetX = endX.current
    const offsetY = endY.current
    const x = offsetX > startX.current ? startX.current : offsetX
    const y = offsetY > startY.current ? startY.current : offsetY
    const width = Math.abs(offsetX - startX.current)
    const height = Math.abs(offsetY - startY.current)
    if (width > 5 && height > 5) {
      onDragSelect && onDragSelect({ x, y, width, height })
    }
    draging.current = false
    moving.current = false
    setRect({ x: 0, y: 0, width: 0, height: 0 })
  }
  useEventListener("mouseup", onMouseUp)
  return (
    <Svg
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
    >
      {children}
      <rect
        x={rect.x}
        y={rect.y}
        width={rect.width}
        height={rect.height}
        fill="#50E3C2"
        fillOpacity={0.5}
      ></rect>
    </Svg>
  )
})

export default SvgContainer
