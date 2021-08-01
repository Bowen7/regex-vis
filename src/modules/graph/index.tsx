import React, { useRef, useState, useEffect } from "react"
import { useTheme, Code, Dot } from "@geist-ui/react"
import { nanoid } from "nanoid"
import { RenderVirtualNode } from "./types"
import { parse, gen, AST } from "@/parser"
import { useUpdateEffect } from "@/utils/hooks"
import renderEngine from "./rendering-engine"
import SvgContainer from "./svg-container"
import { useMainReducer, MainActionTypes } from "@/redux"
type Props = {
  regex: string
  minimum?: boolean
  onChange?: (regex: string) => void
}
const head: AST.RootNode = { id: nanoid(), type: "root" }
const tail: AST.RootNode = { id: nanoid(), type: "root" }
const Graph: React.FC<Props> = ({ regex, minimum = false, onChange }) => {
  const { palette } = useTheme()
  const [{ ast, selectedIds }, dispatch] = useMainReducer()
  const [error, setError] = useState<null | string>(null)

  const regexRef = useRef<string>()

  const [rootRenderNode, setRootRenderNode] = useState<RenderVirtualNode>({
    type: "virtual",
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    children: [],
  })

  useEffect(() => {
    if (regex !== regexRef.current) {
      const ast = parse(regex)
      if (ast.type === "regex") {
        setError(null)
        const { type, body, flags, withSlash } = ast
        dispatch({
          type: MainActionTypes.SET_AST,
          payload: { type, body: [head, ...body, tail], flags, withSlash },
        })
      } else {
        setError(ast.message)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [regex])

  useUpdateEffect(() => {
    const rootRenderNode = renderEngine.render(ast)
    setRootRenderNode(rootRenderNode)
    const nextRegex = gen(ast)
    if (nextRegex !== regexRef.current) {
      regexRef.current = nextRegex
      onChange && onChange(nextRegex)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ast])

  return (
    <>
      <div className="graph">
        {error ? (
          <p>
            <Dot type="error">Error</Dot>(<Code>{regex}</Code>): {error}
          </p>
        ) : (
          <SvgContainer
            rootRenderNode={rootRenderNode}
            selectedIds={selectedIds}
            minimum={minimum}
          />
        )}
      </div>
      <style jsx>{`
        .graph {
          display: inline-block;
        }
        .graph :global(svg) {
          border: 1px solid ${palette.accents_2};
          border-radius: 5px;
        }
        .graph :global(.box-fill) {
          fill: ${palette.success};
        }
        .graph :global(.selected-fill) {
          fill: ${palette.success};
          fill-opacity: 0.3;
        }
        .graph :global(.none-stroke) {
          stroke: none;
        }
        .graph :global(.stroke) {
          stroke: ${palette.accents_6};
          stroke-width: 2px;
        }
        .graph :global(.thin-stroke) {
          stroke: ${palette.accents_6};
          stroke-width: 1.5px;
        }
        .graph :global(.second-stroke) {
          stroke: ${palette.accents_3};
          stroke-width: 1.5px;
        }
        .graph :global(.text) {
          fill: ${palette.foreground};
        }
        .graph :global(.fill) {
          fill: ${palette.background};
        }
        .graph :global(.transparent-fill) {
          fill: transparent;
        }
        .graph :global(.quote) {
          fill: ${palette.accents_4};
        }
      `}</style>
    </>
  )
}

export default Graph
