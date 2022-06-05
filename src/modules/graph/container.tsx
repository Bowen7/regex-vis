import React, { useState, useCallback, useMemo } from "react"
import { useTheme } from "@geist-ui/core"
import { nanoid } from "nanoid"
import { AST } from "@/parser"
import {
  GRAPH_PADDING_VERTICAL,
  GRAPH_PADDING_HORIZONTAL,
  GRAPH_MINIMUM_PADDING_HORIZONTAL,
  GRAPH_MINIMUM_PADDING_VERTICAL,
} from "@/constants"
import Nodes from "./nodes"

const head: AST.RootNode = { id: nanoid(), type: "root" }
const tail: AST.RootNode = { id: nanoid(), type: "root" }

type Props = {
  ast: AST.Regex
  minimum?: boolean
}
const Container: React.FC<Props> = React.memo(({ ast, minimum = false }) => {
  const { palette } = useTheme()
  const [nodesLayout, setNodesLayout] = useState<[number, number]>([0, 0])
  const paddingH = minimum
    ? GRAPH_MINIMUM_PADDING_HORIZONTAL
    : GRAPH_PADDING_HORIZONTAL
  const paddingV = minimum
    ? GRAPH_MINIMUM_PADDING_VERTICAL
    : GRAPH_PADDING_VERTICAL
  const handleLayout = useCallback(
    (index, layout) => setNodesLayout(layout),
    [setNodesLayout]
  )
  const nodes = useMemo(
    () => (minimum ? ast.body : [head, ...ast.body, tail]),
    [ast.body, minimum]
  )

  const svgWidth = nodesLayout[0] + paddingH * 2
  const svgHeight = nodesLayout[1] + paddingV * 2

  return (
    <>
      <svg
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        width={svgWidth}
        height={svgHeight}
      >
        <Nodes
          index={0}
          x={paddingH}
          y={paddingV}
          nodes={nodes}
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
Container.displayName = "SVGContainer"

export default Container
