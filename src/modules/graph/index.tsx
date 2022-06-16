import React, { useState, useMemo } from "react"
import { useTheme, Code, Dot } from "@geist-ui/core"
import hexRgb from "hex-rgb"
import { useSetAtom, Provider, Atom } from "jotai"
import { AST } from "@/parser"
import DoubleBufferingGraph from "./double-buffering-graph"
import {
  selectNodesByBoxAtom,
  recordLayoutEnableAtom,
  selectEnableAtom,
} from "@/atom"
import { useDragSelect } from "@/utils/hooks"
type Props = {
  regex: string
  ast: AST.Regex
  errorMsg?: string | null
}

const initialValues: (readonly [Atom<unknown>, unknown])[] = [
  [recordLayoutEnableAtom, true],
  [selectEnableAtom, true],
]

const Graph: React.FC<Props> = ({ regex, ast, errorMsg = null }) => {
  const selectNodesByBox = useSetAtom(selectNodesByBoxAtom)
  const { palette } = useTheme()
  const selectionColor = useMemo(
    () => hexRgb(palette.success, { format: "css", alpha: 0.5 }),
    [palette.success]
  )

  const [bindings, Selection] = useDragSelect({
    disabled: !!errorMsg,
    style: {
      backgroundColor: selectionColor,
      border: `1.5px solid ${palette.success}`,
      borderRadius: "4px",
    },
    onSelect: (box) => selectNodesByBox(box),
  })

  return (
    <>
      {/* <Provider initialValues={initialValues}> */}
      <div className="graph" {...bindings}>
        {errorMsg ? (
          <p>
            <Dot type="error">Error</Dot>(<Code>{regex}</Code>) {errorMsg}
          </p>
        ) : (
          <>
            {ast.body.length > 0 && <DoubleBufferingGraph ast={ast} />}
            {Selection}
          </>
        )}
      </div>
      {/* </Provider> */}
      <style jsx>{`
        .graph {
          display: inline-block;
          position: relative;
          font-size: ${errorMsg ? "1em" : "0"};
        }
        .graph :global(svg) {
          border: 1px solid ${palette.accents_2};
          border-radius: 5px;
        }
      `}</style>
    </>
  )
}

export default Graph
