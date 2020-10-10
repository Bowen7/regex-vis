import React from "react"
import { Pos } from "@types"
type LineProps = {
  start: Pos
  end: Pos
}

const Line: React.FC<LineProps> = props => {
  const { start, end } = props
  const startX = start.x
  const startY = start.y
  let endX = end.x - 5
  const reverse = startX > endX
  endX = reverse ? endX : endX - 7
  let endY = end.y
  if (reverse) {
    if (endY > startY) {
      endY -= 12
    } else {
      endY += 12
    }
  }
  const centerX = (startX + endX) / 2
  const centerY = (startY + endY) / 2
  return reverse ? (
    <>
      <path
        d={`M${startX} ${startY} Q ${startX},${centerY} ${centerX},${centerY}`}
        stroke="black"
        fill="none"
      ></path>
      <path
        d={`M${centerX} ${centerY} Q ${endX},${centerY} ${endX},${endY}`}
        stroke="black"
        fill="none"
        style={{
          markerEnd: "url(#triangle)",
        }}
      ></path>
    </>
  ) : (
    <path
      d={`M${startX} ${startY} Q ${startX},${endY} ${endX},${endY}`}
      stroke="black"
      fill="none"
      style={{
        markerEnd: "url(#triangle)",
      }}
    ></path>
  )
}

export default Line
