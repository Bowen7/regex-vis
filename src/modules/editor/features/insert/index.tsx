import React, { useMemo } from "react"
import { ButtonDropdown } from "@geist-ui/react"
import Cell from "@/components/cell"
import { AST } from "@/parser"
import { useMainReducer, MainActionTypes } from "@/redux"
type Props = {
  ast: AST.Regex
  nodes: AST.Node[]
}

type InsertDirection = "prev" | "next" | "branch"

const groupOptions = [
  { desc: "Capturing group", kind: "capturing" },
  { desc: "Non-capturing group", kind: "nonCapturing" },
  { desc: "Named capturing group", kind: "namedCapturing" },
]
const lookAroundAssertionOptions = [
  { desc: "Lookahead assertion", kind: "lookahead" },
  { desc: "Lookbehind assertion", kind: "lookbehind" },
]

const Insert: React.FC<Props> = ({ ast, nodes }) => {
  const [, dispatch] = useMainReducer()
  const insertOptions = useMemo(() => {
    const options: { direction: InsertDirection; desc: string }[] = []
    const { body } = ast
    if (nodes.length === 0) {
      return []
    }
    if (body[body.length - 1].id !== nodes[nodes.length - 1].id) {
      options.push({
        direction: "next",
        desc: "Insert after",
      })
    }
    if (body[0].id !== nodes[0].id) {
      options.push({
        direction: "prev",
        desc: "Insert before",
      })
    }
    options.push({
      direction: "branch",
      desc: "Insert as a branch",
    })
    return options
  }, [ast, nodes])

  const handleInsert = (direction: InsertDirection) =>
    dispatch({ type: MainActionTypes.INSERT, payload: { direction } })

  const handleWrapGroup = (kind: string) => {
    let payload: AST.Group
    switch (kind) {
      case "capturing":
        payload = { kind, name: "", index: 0 }
        break
      case "nonCapturing":
        payload = { kind }
        break
      case "namedCapturing":
        payload = { kind, name: "name", index: 0 }
        break
      default:
        return
    }
    dispatch({ type: MainActionTypes.WRAP_GROUP, payload })
  }

  const handleWrapLookAroundAssertion = (kind: string) => {
    dispatch({
      type: MainActionTypes.WRAP_LOOKAROUND_ASSERTION,
      payload: kind as "lookahead" | "lookbehind",
    })
  }
  return (
    <>
      <Cell label="Insert a empty node">
        <ButtonDropdown size="small">
          {insertOptions.map(({ direction, desc }, index) => (
            <ButtonDropdown.Item
              main={index === 0}
              key={direction}
              onClick={() => handleInsert(direction)}
            >
              {desc}
            </ButtonDropdown.Item>
          ))}
        </ButtonDropdown>
      </Cell>
      <Cell label="Wrap with a group">
        <ButtonDropdown size="small">
          {groupOptions.map(({ kind, desc }, index) => (
            <ButtonDropdown.Item
              main={index === 0}
              key={kind}
              onClick={() => handleWrapGroup(kind)}
            >
              {desc}
            </ButtonDropdown.Item>
          ))}
        </ButtonDropdown>
      </Cell>
      <Cell label="Wrap with a lookAround Assertion">
        <ButtonDropdown size="small">
          {lookAroundAssertionOptions.map(({ kind, desc }, index) => (
            <ButtonDropdown.Item
              main={index === 0}
              key={kind}
              onClick={() => handleWrapLookAroundAssertion(kind)}
            >
              {desc}
            </ButtonDropdown.Item>
          ))}
        </ButtonDropdown>
      </Cell>
    </>
  )
}

export default Insert
