import React, { useState } from "react"
import RadioGroup from "@/components/radioGroup"
import Cell from "@/components/cell"
import { charactersOptions } from "./helper"
const Characters: React.FC<{}> = () => {
  const [value, setValue] = useState<string>("string")
  return (
    <>
      <Cell label="Characters:">
        <RadioGroup
          value={value}
          options={charactersOptions}
          onChange={setValue}
        />
      </Cell>
      <style jsx>{``}</style>
    </>
  )
}

export default Characters
