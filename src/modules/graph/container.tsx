import React, { useState, useCallback } from "react"
import { useTheme } from "@geist-ui/core"
import { AST } from "@/parser"
import { GRAPH_NODE_MARGIN_HORIZONTAL, GRAPH_ROOT_RADIUS } from "@/constants"
import Nodes from "./nodes"
import RootNode from "./root"
import MidConnect from "./mid-connect"

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
  const [nodesLayout, setNodesLayout] = useState<[number, number]>([0, 0])
  const paddingH = minimum ? MINIMUM_PADDING_HORIZONTAL : PADDING_HORIZONTAL
  const paddingV = minimum ? MINIMUM_PADDING_VERTICAL : PADDING_VERTICAL
  const handleLayout = useCallback(
    (index: number, width: number, height: number) =>
      setNodesLayout([width, height]),
    [setNodesLayout]
  )

  const svgWidth =
    nodesLayout[0] +
    paddingH * 2 +
    GRAPH_ROOT_RADIUS * 2 +
    GRAPH_NODE_MARGIN_HORIZONTAL * 2
  const svgHeight = nodesLayout[1] + paddingV * 2

  const connectY = svgHeight / 2 - GRAPH_ROOT_RADIUS / 2
  const centerY = svgHeight / 2
  const nodesX = minimum
    ? paddingH
    : paddingH + GRAPH_ROOT_RADIUS + GRAPH_NODE_MARGIN_HORIZONTAL

  return (
    <>
      <svg
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        width={svgWidth}
        height={svgHeight}
      >
        {!minimum && (
          <>
            <RootNode x={paddingH} y={connectY} radius={GRAPH_ROOT_RADIUS} />
            <MidConnect
              start={[paddingH + GRAPH_ROOT_RADIUS, centerY]}
              end={[nodesX, centerY]}
            />
          </>
        )}
        <Nodes
          index={0}
          x={nodesX}
          y={paddingV}
          nodes={ast.body}
          onLayout={handleLayout}
        ></Nodes>
        {!minimum && (
          <>
            <MidConnect
              start={[nodesX + nodesLayout[0], centerY]}
              end={[
                nodesX + nodesLayout[0] + GRAPH_NODE_MARGIN_HORIZONTAL,
                centerY,
              ]}
            />
            <RootNode
              x={nodesX + nodesLayout[0] + GRAPH_NODE_MARGIN_HORIZONTAL}
              y={connectY}
              radius={GRAPH_ROOT_RADIUS}
            />
          </>
        )}
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
