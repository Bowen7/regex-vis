import React, { useState } from "react"
import { Input, Spacer } from "@geist-ui/react"
import RadioGroup from "@/components/radioGroup"
import Cell from "@/components/cell"
import { charactersOptions } from "./helper"
import { Character } from "../../types"
type Prop = {
  character: Character
}
const Characters: React.FC<Prop> = ({ character }) => {
  const [value, setValue] = useState<string>("string")
  return (
    <>
      <Cell label="Characters:">
        <RadioGroup
          value={value}
          options={charactersOptions}
          onChange={setValue}
        />
        <Spacer y={0.5} />
        <Input placeholder="一个基础示例" size="small" />
      </Cell>
      <style jsx>{``}</style>
    </>
  )
}

export default Characters
