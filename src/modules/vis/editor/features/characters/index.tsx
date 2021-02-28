import React, { useState } from "react"
import { Input, Spacer } from "@geist-ui/react"
import RadioGroup from "@/components/radioGroup"
import Cell from "@/components/cell"
import { charactersOptions } from "./helper"
import { Character } from "@/types"
import updateCharacterNode from "@/parser/utils/character"
type Prop = {
  character: Character
}
const Characters: React.FC<Prop> = ({ character }) => {
  const handleStringValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value)
  }
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
          <Input
            size="small"
            value={character.value}
            onChange={handleStringValueChange}
          />
        )}
      </Cell>
      <style jsx>{``}</style>
    </>
  )
}

export default Characters
