import React, { useState } from "react"
import { Radio, Button } from "@geist-ui/react"
export type InsertDirection = "prev" | "next"
export type InsertType = "simple" | "group" | "choice"
type Props = {
  onInert?: (direction: InsertDirection, type: InsertType) => void
}
const InsertItem: React.FC<Props> = props => {
  const { onInert } = props
  const [direction, setDirection] = useState<InsertDirection>("prev")
  const [type, setType] = useState<InsertType>("simple")
  function onDirectionChange(val: React.ReactText) {
    setDirection(val as InsertDirection)
  }
  function onTypeChange(val: React.ReactText) {
    setType(val as InsertType)
  }
  function handleInsert() {
    onInert && onInert(direction, type)
  }
  return (
    <div>
      <p>Direction: </p>
      <Radio.Group
        value={direction}
        onChange={onDirectionChange}
        useRow
        size="mini"
      >
        <Radio value="prev">On prev</Radio>
        <Radio value="next">On next</Radio>
      </Radio.Group>
      <p>Type: </p>
      <Radio.Group value={type} onChange={onTypeChange} useRow size="mini">
        <Radio value="simple">simple</Radio>
        <Radio value="group">group</Radio>
        <Radio value="choice">choice</Radio>
      </Radio.Group>
      <Button onClick={handleInsert}>Insert</Button>
    </div>
  )
}

export default InsertItem
