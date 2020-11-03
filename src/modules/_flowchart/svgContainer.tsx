import React, { useState, useRef } from "react"
import { Box } from "./types"
type Props = {
  width: number
  height: number
  onDragSelect?: (box: Box) => void
}
// todo
// improve drag select when mouse leave the svg area
const SvgContainer: React.FC<Props> = React.memo(props => {
  const { width, height, children, onDragSelect } = props
  const draging = useRef<boolean>(false)
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
    const { offsetX, offsetY } = e.nativeEvent
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
  function onMouseUp(e: React.MouseEvent<SVGSVGElement>) {
    if (!draging.current) {
      return
    }
    const { offsetX, offsetY } = e.nativeEvent
    const x = offsetX > startX.current ? startX.current : offsetX
    const y = offsetY > startY.current ? startY.current : offsetY
    const width = Math.abs(offsetX - startX.current)
    const height = Math.abs(offsetY - startY.current)

    if (width > 5 && height > 5) {
      onDragSelect && onDragSelect({ x, y, width, height })
    }
    draging.current = false
    setRect({ x: 0, y: 0, width: 0, height: 0 })
  }
  return (
    <svg
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
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
    </svg>
  )
})

export default SvgContainer
