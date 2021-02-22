import React, { useState } from "react"
import { Input, Spacer } from "@geist-ui/react"
import RadioGroup from "@/components/radioGroup"
import Cell from "@/components/cell"
import { charactersOptions } from "./helper"
import { Character } from "@/types"
type Prop = {
  character: Character
}
const Characters: React.FC<Prop> = ({ character }) => {
  return (
    <>
      <Cell label="Characters:">
        <RadioGroup
          value={character.type}
          options={charactersOptions}
          onChange={() => {}}
        />
        <Spacer y={0.5} />
        {character.type === "string" && (
          <Input size="small" value={character.value} />
        )}
      </Cell>
      <style jsx>{``}</style>
    </>
  )
}

export default Characters
