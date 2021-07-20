import React from "react"
type Pos = {
  x: number
  y: number
}
type Props = {
  type: "combine" | "split" | "straight"
  start: Pos
  end: Pos
}
const RailConnect: React.FC<Props> = React.memo((props) => {
  const { type, start, end } = props
  let path = ""
  if (Math.abs(start.y - end.y) < 0.5) {
    path = `M${start.x},${start.y}L${end.x},${end.y}`
  } else {
    let M = ""
    let L1 = ""
    let A1 = ""
    let L2 = ""
    let A2 = ""
    let L3 = ""
    if (type === "split") {
      M = `M${start.x},${start.y}`
      L1 = `L${start.x + 10},${start.y}`
      L3 = `L${end.x},${end.y}`
      if (end.y > start.y) {
        A1 = `A5 5 0 0 1, ${start.x + 15},${start.y + 5}`
        L2 = `L${start.x + 15},${end.y - 5}`
        A2 = `A5 5 0 0 0, ${start.x + 20},${end.y}`
      } else {
        A1 = `A5 5 0 0 0, ${start.x + 15},${start.y - 5}`
        L2 = `L${start.x + 15},${end.y + 5}`
        A2 = `A5 5 0 0 1, ${start.x + 20},${end.y}`
      }
    }
    if (type === "combine") {
      M = `M${end.x},${end.y}`
      L1 = `L${end.x - 10},${end.y}`
      L3 = `L${start.x},${start.y}`
      if (end.y > start.y) {
        A1 = `A5 5 0 0 1, ${end.x - 15},${end.y - 5}`
        L2 = `L${end.x - 15},${start.y + 5}`
        A2 = `A5 5 0 0 0, ${end.x - 20},${start.y}`
      } else {
        A1 = `A5 5 0 0 0, ${end.x - 15},${end.y + 5}`
        L2 = `L${end.x - 15},${start.y - 5}`
        A2 = `A5 5 0 0 1, ${end.x - 20},${start.y}`
      }
    }
    path = M + L1 + A1 + L2 + A2 + L3
  }
  return <path d={path} className="stroke" fill="none"></path>
})

export default RailConnect
