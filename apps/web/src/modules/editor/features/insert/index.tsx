import React, { useMemo } from "react"
import { Button, ButtonGroup } from "@geist-ui/core"
import { useTranslation } from "react-i18next"
import { useSetAtom } from "jotai"
import Cell from "@/components/cell"
import ShowMore from "@/components/show-more"
import { AST } from "@/parser"
import { insertAtom, groupSelectedAtom, lookAroundSelectedAtom } from "@/atom"
type Props = {
  nodes: AST.Node[]
}

type InsertDirection = "prev" | "next" | "branch"

type Option = {
  value: string
  label: string
}

const Insert: React.FC<Props> = ({ nodes }) => {
  const { t, i18n } = useTranslation()
  const language = i18n.language
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
        label: "Before",
      })
    }

    options.push({
      value: "branch",
      label: "Parallel",
    })

    if (!(tail.type === "boundaryAssertion" && tail.kind === "end")) {
      options.push({
        value: "next",
        label: "After",
      })
    }
    return options
  }, [nodes])

  const groupOptions: Option[] = useMemo(() => {
    if (nodes.length === 1 && nodes[0].type === "group") {
      return []
    }
    return [
      {
        value: "capturing",
        label: "Capturing",
      },
      {
        value: "nonCapturing",
        label: "Non-\ncapturing",
      },
      {
        value: "namedCapturing",
        label: "Named\ncapturing",
      },
    ]
  }, [nodes])

  const lookAroundOptions: Option[] = useMemo(() => {
    if (nodes.length === 1 && nodes[0].type === "lookAroundAssertion") {
      return []
    }
    return [
      { value: "lookahead", label: "Lookahead" },
      { value: "lookbehind", label: "Lookahead" },
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
    <>
      <div id="test" className="insert-section">
        {insertOptions.length > 0 && (
          <Cell label={t("Insert around")}>
            <ButtonGroup>
              {insertOptions.map(({ value, label }) => (
                <Button
                  className={language !== "en" ? "small-button-font" : ""}
                  key={value}
                  onClick={() => handleInsert(value as InsertDirection)}
                >
                  {t(label)}
                </Button>
              ))}
            </ButtonGroup>
          </Cell>
        )}
        {groupOptions.length > 0 && (
          <Cell label={t("Group selection")} mdnLinkKey="group">
            <ButtonGroup className="small-button-font">
              {groupOptions.map(({ value, label }) => (
                <Button
                  className="small-button-font"
                  key={value}
                  onClick={() => handleWrapGroup(value)}
                >
                  {t(label)}
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
                {lookAroundOptions.map(({ value, label }) => (
                  <Button
                    className="small-button-font"
                    key={value}
                    onClick={() => handleWrapLookAroundAssertion(value)}
                  >
                    {t(label)}
                  </Button>
                ))}
              </ButtonGroup>
            </Cell>
          </ShowMore>
        )}
      </div>
      <style jsx>
        {`
          .insert-section :global(.btn) {
            white-space: pre;
            line-height: 1;
          }
        `}
      </style>
      <style jsx global>
        {`
          .small-button-font > .text {
            font-size: 12px;
            text-transform: none;
          }
        `}
      </style>
    </>
  )
}

export default Insert
