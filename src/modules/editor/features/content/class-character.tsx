import React, { useMemo } from "react"
import { Spacer, Select, Code } from "@geist-ui/react"
import Input from "@/components/input"
import { characterClassTextMap, CharacterClassKey } from "@/parser"
import { useMainReducer, MainActionTypes } from "@/redux"

const classOptions: { value: CharacterClassKey; text: string }[] = []
for (let key in characterClassTextMap) {
  classOptions.push({
    value: key as CharacterClassKey,
    text: characterClassTextMap[key as CharacterClassKey],
  })
}

const xhhRegex = /^\\x[0-9a-fA-F]{2}$/
const uhhhhRegex = /^\\u[0-9a-fA-F]{4}$/

type Props = {
  value: string
}
const ClassCharacter: React.FC<Props> = ({ value }) => {
  const [, dispatch] = useMainReducer()

  const classKind = useMemo(() => {
    if (xhhRegex.test(value)) {
      return "\\xhh"
    } else if (uhhhhRegex.test(value)) {
      return "\\uhhhh"
    }
    return value
  }, [value])

  const handleSelectChange = (value: string | string[]) => {
    value = value as string
    if (value === "\\xhh") {
      value = "\\x00"
    } else if (value === "\\uhhhh") {
      value = "\\u0000"
    }
    dispatch({
      type: MainActionTypes.UPDATE_CONTENT,
      payload: {
        kind: "class",
        value,
      },
    })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    dispatch({
      type: MainActionTypes.UPDATE_CONTENT,
      payload: {
        kind: "class",
        value: e.target.value,
      },
    })
  return (
    <>
      <Select
        value={classKind}
        onChange={handleSelectChange}
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
      <Spacer y={1} />
      {classKind === "\\xhh" && (
        <Input
          value={value}
          validation={xhhRegex}
          onChange={handleInputChange}
        />
      )}
      {classKind === "\\uhhhh" && (
        <Input
          value={value}
          validation={uhhhhRegex}
          onChange={handleInputChange}
        />
      )}
    </>
  )
}

export default ClassCharacter
