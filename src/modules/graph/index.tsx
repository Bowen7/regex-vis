import React, { useRef, useState, useEffect } from "react"
import { useTheme } from "@geist-ui/react"
import { RenderVirtualNode } from "./types"
import { parse, gen, AST } from "@/parser"
import renderEngine from "./rendering-engine"
import SvgContainer from "./svg-container"
import { useMainReducer, MainActionTypes } from "@/redux"
type Props = {
  regex: string
  minimum?: boolean
  onChange?: (regex: string) => void
}

const Graph: React.FC<Props> = ({ regex, minimum = false, onChange }) => {
  const { palette } = useTheme()
  const [{ ast, selectedIds }, dispatch] = useMainReducer()

  const regexRef = useRef<string>("")

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
        dispatch({ type: MainActionTypes.SET_AST, payload: { ast } })
      }
    }
  }, [regex, dispatch])

  useEffect(() => {
    const rootRenderNode = renderEngine.render(ast)
    regexRef.current = gen(ast.body)
    onChange && onChange(regexRef.current)
    setRootRenderNode(rootRenderNode)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ast])

  return (
    <>
      <div className="graph">
        <SvgContainer
          rootRenderNode={rootRenderNode}
          selectedIds={selectedIds}
          minimum={minimum}
        />
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
