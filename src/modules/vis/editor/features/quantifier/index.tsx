import React, { useState } from "react"
import { Checkbox } from "@geist-ui/react"
import Cell from "@/components/cell"
import RadioGroup from "@/components/radioGroup"
import { quantifierOptions } from "./helper"
const Quantifier: React.FC<{}> = () => {
  const [times, setTimes] = useState("non")
  return (
    <>
      <Cell label="Quantifier times:">
        <RadioGroup
          options={quantifierOptions}
          value={times}
          onChange={setTimes}
        />
      </Cell>
      <Cell label="Quantifier greedy:">
        <Checkbox initialChecked={true}>Greedy</Checkbox>
      </Cell>
    </>
  )
}

export default Quantifier
