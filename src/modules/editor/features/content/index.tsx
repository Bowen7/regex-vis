import React, { useMemo } from "react"
import { Select, useTheme, Spacer } from "@geist-ui/react"
import Cell from "@/components/cell"
import { AST } from "@/parser"
import QuestionCircle from "@geist-ui/react-icons/questionCircle"
import questions, { isQuestionKey } from "@/utils/questions"
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
import {
  astAtom,
  groupNamesAtom,
  useAtomValue,
  dispatchUpdateContent,
} from "@/atom"
import Ranges from "./ranges"

type Prop = {
  content: AST.Content
  id: string
  quantifier: AST.Quantifier | null
}
const ContentEditor: React.FC<Prop> = ({ content, id, quantifier }) => {
  const groupNames = useAtomValue(groupNamesAtom)
  const ast = useAtomValue(astAtom)
  const { palette } = useTheme()
  const { kind } = content

  const options = useMemo(() => {
    const options = [...characterOptions, wordBoundaryAssertionOption]
    if (groupNames.length !== 0 || kind === "backReference") {
      options.push(backRefOption)
    }
    if (ast.body[1].id === id || kind === "beginningAssertion") {
      options.push(beginningAssertionOption)
    }
    if (ast.body[ast.body.length - 2].id === id || kind === "endAssertion") {
      options.push(endAssertionOption)
    }
    return options
  }, [groupNames, kind, ast, id])

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
    dispatchUpdateContent(payload)
  }

  return (
    <>
      <Cell label="Content">
        <Cell.Item label="Type">
          <div className="type">
            <Select
              value={content.kind}
              onChange={handleTypeChange}
              getPopupContainer={() =>
                document.getElementById("editor-content")
              }
              disableMatchWidth
            >
              {options.map(({ value, label }) => (
                <Select.Option value={value} key={value}>
                  <div>{label}</div>
                </Select.Option>
              ))}
            </Select>
            <Spacer inline x={0.5} />
            {isQuestionKey(content.kind) && (
              <a
                href={questions[content.kind]}
                target="_blank"
                rel="noreferrer"
              >
                <QuestionCircle size={16} />
              </a>
            )}
          </div>
        </Cell.Item>

        {content.kind === "string" && (
          <SimpleString value={content.value} quantifier={quantifier} />
        )}
        {content.kind === "ranges" && (
          <Ranges ranges={content.ranges} negate={content.negate} />
        )}
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
        .type {
          display: flex;
          align-items: center;
        }
        .type a {
          color: ${palette.foreground};
          font-size: 0;
        }
      `}</style>
    </>
  )
}

export default ContentEditor
