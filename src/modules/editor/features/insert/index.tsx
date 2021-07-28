import React, { useMemo } from "react"
import { Button, ButtonGroup, Tooltip } from "@geist-ui/react"
import Cell from "@/components/cell"
import {
  InsertBefore,
  InsertAfter,
  InsertBranch,
  CapturingGroup,
  NonCapturingGroup,
  NamedCapturingGroup,
  Lookahead,
  Lookbehind,
} from "@/components/icons"
import { AST } from "@/parser"
import { useMainReducer, MainActionTypes } from "@/redux"
type Props = {
  ast: AST.Regex
  nodes: AST.Node[]
}

type InsertDirection = "prev" | "next" | "branch"

type Option = { desc: string; value: string; Icon: () => JSX.Element }

const Insert: React.FC<Props> = ({ ast, nodes }) => {
  const [, dispatch] = useMainReducer()

  const insertOptions = useMemo(() => {
    const options: Option[] = []
    const { body } = ast
    if (nodes.length === 0) {
      return []
    }
    const bodyHead = body[0]
    const head = nodes[0]
    const bodyTail = body[body.length - 1]
    const tail = nodes[nodes.length - 1]
    if (
      bodyHead.id !== head.id &&
      !(head.type === "boundaryAssertion" && head.kind === "beginning")
    ) {
      options.push({
        value: "prev",
        desc: "Insert before",
        Icon: InsertBefore,
      })
    }

    options.push({
      value: "branch",
      desc: "Insert as a branch",
      Icon: InsertBranch,
    })

    if (
      bodyTail.id !== tail.id &&
      !(tail.type === "boundaryAssertion" && tail.kind === "end")
    ) {
      options.push({
        value: "next",
        desc: "Insert after",
        Icon: InsertAfter,
      })
    }
    return options
  }, [ast, nodes])

  const groupOptions: Option[] = useMemo(() => {
    if (nodes.length === 1 && nodes[0].type === "group") {
      return []
    }
    return [
      { desc: "Capturing group", value: "capturing", Icon: CapturingGroup },
      {
        desc: "Non-capturing group",
        value: "nonCapturing",
        Icon: NonCapturingGroup,
      },
      {
        desc: "Named capturing group",
        value: "namedCapturing",
        Icon: NamedCapturingGroup,
      },
    ]
  }, [nodes])

  const lookAroundOptions: Option[] = useMemo(() => {
    if (nodes.length === 1 && nodes[0].type === "lookAroundAssertion") {
      return []
    }
    return [
      { desc: "Lookahead assertion", value: "lookahead", Icon: Lookahead },
      { desc: "Lookbehind assertion", value: "lookbehind", Icon: Lookbehind },
    ]
  }, [nodes])

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
    <div id="test">
      {insertOptions.length > 1 && (
        <Cell label="Insert around">
          <ButtonGroup>
            {insertOptions.map(({ value, desc, Icon }) => (
              <Button
                onClick={() => handleInsert(value as InsertDirection)}
                key={value}
              >
                <Tooltip text={desc} placement="topEnd">
                  <Icon />
                </Tooltip>
              </Button>
            ))}
          </ButtonGroup>
        </Cell>
      )}
      {groupOptions.length > 0 && (
        <Cell label="Group selection" question="group">
          <ButtonGroup>
            {groupOptions.map(({ value, desc, Icon }) => (
              <Button onClick={() => handleWrapGroup(value)} key={value}>
                <Tooltip text={desc} placement="topEnd">
                  <Icon />
                </Tooltip>
              </Button>
            ))}
          </ButtonGroup>
        </Cell>
      )}
      {lookAroundOptions.length > 0 && (
        <Cell label="LookAround selection" question="lookAround">
          <ButtonGroup>
            {lookAroundOptions.map(({ value, desc, Icon }) => (
              <Button
                onClick={() => handleWrapLookAroundAssertion(value)}
                key={value}
              >
                <Tooltip text={desc} placement="topEnd">
                  <Icon />
                </Tooltip>
              </Button>
            ))}
          </ButtonGroup>
        </Cell>
      )}
    </div>
  )
}

export default Insert
