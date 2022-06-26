import React, { useMemo, useCallback, useRef, useState } from "react"
import { AST } from "@/parser"
import {
  GRAPH_NODE_MARGIN_VERTICAL,
  GRAPH_CHOICE_PADDING_HORIZONTAL,
  GRAPH_CHOICE_PADDING_VERTICAL,
} from "@/constants"
import Nodes from "./nodes"
import StartConnect from "./start-connect"
import EndConnect from "./end-connect"
import Content from "./content"
type Props = {
  index: number
  x: number
  y: number
  node: AST.ChoiceNode
  selected: boolean
  onLayout: (index: number, layout: [number, number]) => void
}

const ChoiceNode = React.memo(
  ({ index, x, y, selected, node, onLayout }: Props) => {
    const { id, branches } = node
    const layoutCount = useRef(0)
    const [layout, setLayout] = useState<[number, number]>([0, 0])
    const layoutsRef = useRef<[number, number][]>([])
    const [layouts, setLayouts] = useState<[number, number][]>([])

    const rects = useMemo(() => {
      let curY = y + GRAPH_CHOICE_PADDING_VERTICAL
      return new Array(branches.length).fill(0).map((_, index) => {
        if (!layouts[index]) {
          return { x: 0, y: 0, width: 0, height: 0 }
        }
        const [width, height] = layouts[index]
        const nodeX = x + (layout[0] - width) / 2
        const nodeY = curY
        curY += height + GRAPH_NODE_MARGIN_VERTICAL
        return { width, height, x: nodeX, y: nodeY }
      })
    }, [branches, x, y, layout, layouts])

    const handleNodeLayout = useCallback(
      (branchIndex: number, branchLayout: [number, number]) => {
        layoutsRef.current[branchIndex] = branchLayout
        layoutCount.current++
        if (layoutCount.current % branches.length === 0) {
          const [width, height] = layoutsRef.current.reduce(
            ([width, height], [nodesWidth, nodesHeight]) => [
              Math.max(width, nodesWidth + 2 * GRAPH_CHOICE_PADDING_HORIZONTAL),
              height + nodesHeight,
            ],
            [
              0,
              (layoutsRef.current.length - 1) * GRAPH_NODE_MARGIN_VERTICAL +
                GRAPH_CHOICE_PADDING_VERTICAL * 2,
            ]
          )
          onLayout(index, [width, height])
          setLayout([width, height])
          setLayouts(layoutsRef.current.slice())
        }
      },
      [index, branches.length, onLayout]
    )
    return (
      <Content
        selected={selected}
        id={node.id}
        className="transparent-fill"
        x={x}
        y={y}
        width={layout[0]}
        height={layout[1]}
      >
        {branches.map((branch, index) => {
          const {
            x: nodeX,
            y: nodeY,
            width: nodeWidth,
            height: nodeHeight,
          } = rects[index]
          return (
            <React.Fragment key={index}>
              <StartConnect
                start={[x, y + layout[1] / 2]}
                end={[nodeX, nodeY + nodeHeight / 2]}
              />
              <Nodes
                id={id}
                key={index}
                index={index}
                x={nodeX}
                y={nodeY}
                nodes={branch}
                onLayout={handleNodeLayout}
              />
              <EndConnect
                start={[nodeX + nodeWidth, nodeY + nodeHeight / 2]}
                end={[x + layout[0], y + layout[1] / 2]}
              />
            </React.Fragment>
          )
        })}
      </Content>
    )
  }
)
ChoiceNode.displayName = "ChoiceName"
export default ChoiceNode
