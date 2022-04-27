import React, { useState } from "react"
import { useTheme, Code, Dot } from "@geist-ui/core"
import { RenderNode, RenderConnect, Box } from "./types"
import { useUpdateEffect } from "react-use"
import { AST } from "@/parser"
import renderEngine from "./rendering-engine"
import SvgContainer from "./svg-container"
import { selectedIdsAtom, useAtomValue, dispatchSelectNodes } from "@/atom"
type Props = {
  regex: string
  ast: AST.Regex
  minimum?: boolean
  errorMsg?: string | null
}

const Graph: React.FC<Props> = ({
  regex,
  ast,
  errorMsg = null,
  minimum = false,
}) => {
  const { palette } = useTheme()
  const selectedIds = useAtomValue(selectedIdsAtom)

  const [renderInfo, setRenderInfo] = useState<{
    width: number
    height: number
    nodes: RenderNode[]
    connects: RenderConnect[]
  }>({
    width: 0,
    height: 0,
    nodes: [],
    connects: [],
  })

  useUpdateEffect(() => {
    const renderInfo = renderEngine.render(ast)
    setRenderInfo(renderInfo)
  }, [ast])

  const onDragSelect = (box: Box) => {
    const selectedIds = renderEngine.selectByBound(box)
    dispatchSelectNodes(selectedIds)
  }

  return (
    <>
      <div className="graph">
        {errorMsg ? (
          <p>
            <Dot type="error">Error</Dot>(<Code>{regex}</Code>): {errorMsg}
          </p>
        ) : (
          <SvgContainer
            {...renderInfo}
            selectedIds={selectedIds}
            minimum={minimum}
            onDragSelect={onDragSelect}
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
