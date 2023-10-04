import React, { useMemo } from "react"
import { useTheme, Code, Dot } from "@geist-ui/core"
import hexRgb from "hex-rgb"
import { useSetAtom } from "jotai"
import { AST } from "@/parser"
import { selectNodesByBoxAtom } from "@/atom"
import { useDragSelect } from "@/utils/hooks"
import ASTGraph from "./ast-graph"
type Props = {
  regex: string
  ast: AST.Regex
  errorMsg?: string | null
}

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
      <div className="graph" {...bindings}>
        {errorMsg ? (
          <p>
            <Dot type="error">Error</Dot>(<Code>{regex}</Code>) {errorMsg}
          </p>
        ) : (
          <>
            {ast.body.length > 0 && <ASTGraph ast={ast} />}
            {Selection}
          </>
        )}
      </div>
      <style jsx>{`
        .graph {
          display: inline-block;
          position: relative;
          font-size: ${errorMsg ? "1em" : "0"};
        }
      `}</style>
    </>
  )
}

export default Graph
