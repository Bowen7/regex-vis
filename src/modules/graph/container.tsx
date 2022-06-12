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
  selectedIds?: string[]
  onLayout?: () => void
}

const Container = React.memo(
  ({ ast, minimum = false, selectedIds = [], onLayout = () => {} }: Props) => {
    const { palette } = useTheme()
    const [layout, setLayout] = useState<[number, number]>([0, 0])
    const paddingH = minimum
      ? GRAPH_MINIMUM_PADDING_HORIZONTAL
      : GRAPH_PADDING_HORIZONTAL
    const paddingV = minimum
      ? GRAPH_MINIMUM_PADDING_VERTICAL
      : GRAPH_PADDING_VERTICAL
    const handleLayout = useCallback(
      (index: number, [width, height]: [number, number]) => {
        const svgWidth = width + paddingH * 2
        const svgHeight = height + paddingV * 2
        setLayout([svgWidth, svgHeight])
        onLayout()
      },
      [paddingH, paddingV, onLayout]
    )
    const nodes = useMemo(
      () => (minimum ? ast.body : [head, ...ast.body, tail]),
      [ast.body, minimum]
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
            id={ast.id}
            index={0}
            x={paddingH}
            y={paddingV}
            minimum={minimum}
            nodes={nodes}
            selectedIds={selectedIds}
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
  }
)
Container.displayName = "SVGContainer"

export default Container
