import React from "react"
type Props = {
  regex: string
}
const PatternItem: React.FC<Props> = props => {
  const { regex } = props
  return <p>Selected pattern: {regex}</p>
}

export default PatternItem
