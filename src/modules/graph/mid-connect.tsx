import React from "react"
type Props = {
  start: [number, number]
  end: [number, number]
}
const MidConnect: React.FC<Props> = React.memo((props) => {
  const { start, end } = props
  const path = `M${start[0]},${start[1]}L${end[0]},${end[1]}`
  return <path d={path} className="stroke" fill="none"></path>
})

export default MidConnect
