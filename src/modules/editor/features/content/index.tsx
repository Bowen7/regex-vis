import React, { useMemo } from "react"
import { Select, useTheme } from "@geist-ui/react"
import Cell from "@/components/cell"
import { AST } from "@/parser"
import SimpleString from "./simple-string"
import ClassCharacter from "./class-character"
import BackRef from "./back-ref"
import WordBoundary from "./word-boundary"
import {
  characterOptions,
  backRefOption,
  beginningAssertionOption,
  endAssertionOption,
  wordBoundaryAssertionOption,
} from "./helper"
import { useMainReducer, MainActionTypes } from "@/redux"
import Ranges from "./ranges"

type Prop = {
  content: AST.Content
  id: string
}
const ContentEditor: React.FC<Prop> = ({ content, id }) => {
  const [{ maxGroupIndex, ast }, dispatch] = useMainReducer()
  const { palette } = useTheme()
  const { kind } = content

  const options = useMemo(() => {
    const options = [...characterOptions, wordBoundaryAssertionOption]
    if (maxGroupIndex !== 0 || kind === "backReference") {
      options.push(backRefOption)
    }
    if (ast.body[0].id === id || kind === "beginningAssertion") {
      options.push(beginningAssertionOption)
    }
    if (ast.body[ast.body.length - 1].id === id || kind === "endAssertion") {
      options.push(endAssertionOption)
    }
    return options
  }, [maxGroupIndex, kind, ast, id])

  const handleTypeChange = (type: string | string[]) => {
    let payload: AST.Content
    switch (type) {
      case "string":
        payload = { kind: "string", value: "" }
        break
      case "class":
        payload = { kind: "class", value: "" }
        break
      case "ranges":
        payload = {
          kind: "ranges",
          ranges: [{ from: "", to: "" }],
          negate: false,
        }
        break
      case "backReference":
        payload = { kind: "backReference", ref: "1" }
        break
      case "beginningAssertion":
      case "endAssertion":
        payload = { kind: type }
        break
      case "wordBoundaryAssertion":
        payload = { kind: "wordBoundaryAssertion", negate: false }
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

        {content.kind === "string" && <SimpleString value={content.value} />}
        {content.kind === "ranges" && <Ranges ranges={content.ranges} />}
        {content.kind === "class" && <ClassCharacter value={content.value} />}
        {content.kind === "backReference" && (
          <BackRef reference={content.ref} />
        )}
        {content.kind === "wordBoundaryAssertion" && (
          <WordBoundary negate={content.negate} />
        )}
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
