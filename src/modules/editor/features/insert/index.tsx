import React, { useMemo } from "react"
import { Button, ButtonGroup, Tooltip } from "@geist-ui/core"
import { useTranslation } from "react-i18next"
import { useSetAtom } from "jotai"
import Cell from "@/components/cell"
import ShowMore from "@/components/show-more"
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
import { insertAtom, groupSelectedAtom, lookAroundSelectedAtom } from "@/atom"
type Props = {
  ast: AST.Regex
  nodes: AST.Node[]
}

type InsertDirection = "prev" | "next" | "branch"

type Option = { desc: string; value: string; Icon: () => JSX.Element }

const Insert: React.FC<Props> = ({ ast, nodes }) => {
  const { t } = useTranslation()
  const insert = useSetAtom(insertAtom)
  const groupSelected = useSetAtom(groupSelectedAtom)
  const lookAroundSelected = useSetAtom(lookAroundSelectedAtom)

  const insertOptions = useMemo(() => {
    const options: Option[] = []
    if (nodes.length === 0) {
      return []
    }
    const head = nodes[0]
    const tail = nodes[nodes.length - 1]
    if (!(head.type === "boundaryAssertion" && head.kind === "beginning")) {
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

    if (!(tail.type === "boundaryAssertion" && tail.kind === "end")) {
      options.push({
        value: "next",
        desc: "Insert after",
        Icon: InsertAfter,
      })
    }
    return options
  }, [nodes])

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

  const handleInsert = (direction: InsertDirection) => insert(direction)

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
    groupSelected(payload)
  }

  const handleWrapLookAroundAssertion = (kind: string) =>
    lookAroundSelected(kind as "lookahead" | "lookbehind")

  return (
    <div id="test">
      {insertOptions.length > 0 && (
        <Cell label={t("Insert around")}>
          <ButtonGroup>
            {insertOptions.map(({ value, desc, Icon }) => (
              <Button
                onClick={() => handleInsert(value as InsertDirection)}
                key={value}
              >
                <Tooltip text={t(desc)} placement="topEnd">
                  <Icon />
                </Tooltip>
              </Button>
            ))}
          </ButtonGroup>
        </Cell>
      )}
      {groupOptions.length > 0 && (
        <Cell label={t("Group selection")} mdnLinkKey="group">
          <ButtonGroup>
            {groupOptions.map(({ value, desc, Icon }) => (
              <Button onClick={() => handleWrapGroup(value)} key={value}>
                <Tooltip text={t(desc)} placement="topEnd">
                  <Icon />
                </Tooltip>
              </Button>
            ))}
          </ButtonGroup>
        </Cell>
      )}

      {lookAroundOptions.length > 0 && (
        <ShowMore id="lookAround">
          <Cell
            label={t("Lookahead/LookBehind assertion selection")}
            mdnLinkKey="lookAround"
          >
            <ButtonGroup>
              {lookAroundOptions.map(({ value, desc, Icon }) => (
                <Button
                  onClick={() => handleWrapLookAroundAssertion(value)}
                  key={value}
                >
                  <Tooltip text={t(desc)} placement="topEnd">
                    <Icon />
                  </Tooltip>
                </Button>
              ))}
            </ButtonGroup>
          </Cell>
        </ShowMore>
      )}
    </div>
  )
}

export default Insert
