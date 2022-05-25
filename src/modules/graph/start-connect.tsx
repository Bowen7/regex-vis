import React from "react"
import MidConnect from "./mid-connect"
type Props = {
  start: [number, number]
  end: [number, number]
}
const StartConnect: React.FC<Props> = React.memo((props) => {
  const { start, end } = props
  if (Math.abs(start[1] - end[1]) < 0.5) {
    return <MidConnect start={start} end={end} />
  }
  const M = `M${start[0]},${start[1]}`
  const L1 = `L${start[0] + 10},${start[1]}`
  const L3 = `L${end[0]},${end[1]}`
  let A1 = ""
  let L2 = ""
  let A2 = ""
  if (end[1] > start[1]) {
    A1 = `A5 5 0 0 1, ${start[0] + 15},${start[1] + 5}`
    L2 = `L${start[0] + 15},${end[1] - 5}`
    A2 = `A5 5 0 0 0, ${start[0] + 20},${end[1]}`
  } else {
    A1 = `A5 5 0 0 0, ${start[0] + 15},${start[1] - 5}`
    L2 = `L${start[0] + 15},${end[1] + 5}`
    A2 = `A5 5 0 0 1, ${start[0] + 20},${end[1]}`
  }
  const path = M + L1 + A1 + L2 + A2 + L3
  return <path d={path} className="stroke" fill="none"></path>
})

export default StartConnect
