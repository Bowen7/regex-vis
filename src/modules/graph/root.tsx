import React from "react"
type Props = {
  x: number
  y: number
  radius: number
}

const RootNode = (props: Props) => {
  const { x, y, radius } = props
  return (
    <rect
      x={x}
      y={y}
      width={radius}
      height={radius}
      rx={radius}
      ry={radius}
      className="stroke"
    />
  )
}

export default RootNode
