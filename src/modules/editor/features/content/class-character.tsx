import React from "react"
import { Spacer, Select, Code } from "@geist-ui/react"
import {
  characterClassTextMap,
  CharacterClassKey,
} from "@/parser/utils/character-class"

const classOptions: { value: CharacterClassKey; text: string }[] = []
for (let key in characterClassTextMap) {
  classOptions.push({
    value: key as CharacterClassKey,
    text: characterClassTextMap[key as CharacterClassKey],
  })
}

type Props = {
  value: string
}
const ClassCharacter: React.FC<Props> = ({ value }) => {
  const handleChange = () => {}
  return (
    <Select
      value={value}
      onChange={handleChange}
      getPopupContainer={() => document.getElementById("editor-content")}
      disableMatchWidth
    >
      {classOptions.map(({ value, text }) => (
        <Select.Option value={value} key={value}>
          <div>
            <Code>{value}</Code>
            <Spacer x={0.5} inline />
            {text}
          </div>
        </Select.Option>
      ))}
    </Select>
  )
}

export default ClassCharacter
