import React, { useState, useMemo } from "react"
import { useTheme, Code, Dot } from "@geist-ui/core"
import hexRgb from "hex-rgb"
import { useUpdateEffect } from "react-use"
import { AST } from "@/parser"
import SvgContainer from "./container"
import { selectedIdsAtom } from "@/atom"
import { useDragSelect } from "@/utils/hooks"
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
  const opacitySuccessColor = useMemo(
    () => hexRgb(palette.success, { format: "css", alpha: 0.5 }),
    [palette.success]
  )
  const [bindings, Selection] = useDragSelect({
    disabled: !!errorMsg,
    style: {
      backgroundColor: opacitySuccessColor,
      border: `1.5px solid ${palette.success}`,
      borderRadius: "4px",
    },
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
            <SvgContainer ast={ast} minimum={minimum} />
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
