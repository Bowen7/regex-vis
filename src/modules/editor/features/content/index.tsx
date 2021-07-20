import React, { useState, useEffect } from "react"
import { Spacer, Select, Code, useTheme } from "@geist-ui/react"
import Input from "@/components/input"
import Cell from "@/components/cell"
import SimpleString from "./simple-string"
import ClassCharacter from "./class-character"
import { options } from "./helper"
import { CharacterClassKey } from "@/parser/utils/character-class"
import { AST } from "@/parser"
import { useMainReducer, MainActionTypes } from "@/redux"
import { classOptions, labelMap } from "./helper"
import Ranges from "./ranges"
import { Content } from "../../types"

type Prop = {
  content: Content
  id: string
}
const ContentEditor: React.FC<Prop> = ({ content }) => {
  const [, dispatch] = useMainReducer()
  const { palette } = useTheme()

  const handleTypeChange = (type: string | string[]) => {
    let payload: Content
    switch (type) {
      case "string":
        payload = { kind: "string", value: "" }
        break
      case "class":
        payload = { kind: "class", value: "" }
        break
      case "ranges":
        payload = { kind: "ranges", ranges: [], negate: false }
        break
      default:
        return
    }
    dispatch({
      type: MainActionTypes.UPDATE_CONTENT,
      payload,
    })
  }

  return (
    <>
      <Cell label="Content">
        <Cell.Item label="Type">
          <Select
            value={content.kind}
            onChange={handleTypeChange}
            getPopupContainer={() => document.getElementById("editor-content")}
            disableMatchWidth
          >
            {options.map(({ value, label }) => (
              <Select.Option value={value} key={value}>
                <div>{label}</div>
              </Select.Option>
            ))}
          </Select>
        </Cell.Item>

        <Cell.Item label={labelMap[content.kind]}>
          {content.kind === "string" && <SimpleString value={content.value} />}
          {content.kind === "ranges" && <Ranges ranges={content.ranges} />}
          {content.kind === "class" && <ClassCharacter value={content.value} />}
        </Cell.Item>
      </Cell>
      <style jsx>{`
        h6 {
          color: ${palette.secondary};
        }
      `}</style>
    </>
  )
}

export default ContentEditor
