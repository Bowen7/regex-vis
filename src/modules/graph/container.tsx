import React, { useState, useCallback } from "react"
import { useTheme } from "@geist-ui/core"
import { AST } from "@/parser"
import Nodes from "./nodes"

const PADDING_VERTICAL = 50
const PADDING_HORIZONTAL = 50
const MINIMUM_PADDING_VERTICAL = 5
const MINIMUM_PADDING_HORIZONTAL = 5

type Props = {
  ast: AST.Regex
  minimum?: boolean
}
const Container: React.FC<Props> = React.memo(({ ast, minimum = false }) => {
  const { palette } = useTheme()
  const [layout, setLayout] = useState<[number, number]>([0, 0])
  const paddingH = minimum ? MINIMUM_PADDING_HORIZONTAL : PADDING_HORIZONTAL
  const paddingV = minimum ? MINIMUM_PADDING_VERTICAL : PADDING_VERTICAL
  const handleLayout = useCallback(
    (index: number, width: number, height: number) => {
      setLayout([width + paddingH * 2, height + paddingV * 2])
    },
    [setLayout, paddingH, paddingV]
  )
  return (
    <>
      <svg
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        width={layout[0]}
        height={layout[1]}
      >
        <Nodes
          index={0}
          x={paddingH}
          y={paddingV}
          nodes={ast.body}
          onLayout={handleLayout}
        ></Nodes>
      </svg>
      <style jsx>{`
        svg {
          border: ${minimum ? "none" : `1px solid ${palette.accents_2}`};
          border-radius: 5px;
        }
        svg :global(.box-fill) {
          fill: ${palette.success};
        }
        svg :global(.selected-fill) {
          fill: ${palette.success};
          fill-opacity: 0.3;
        }
        svg :global(.none-stroke) {
          stroke: none;
        }
        svg :global(.stroke) {
          stroke: ${palette.accents_6};
          stroke-width: 2px;
        }
        svg :global(.thin-stroke) {
          stroke: ${palette.accents_6};
          stroke-width: 1.5px;
        }
        svg :global(.second-stroke) {
          stroke: ${palette.accents_3};
          stroke-width: 1.5px;
        }
        svg :global(.text) {
          fill: ${palette.foreground};
        }
        svg :global(.fill) {
          fill: ${palette.background};
        }
        svg :global(.transparent-fill) {
          fill: transparent;
        }
        svg :global(.quote) {
          fill: ${palette.accents_4};
        }
      `}</style>
    </>
  )
})

export default Container
