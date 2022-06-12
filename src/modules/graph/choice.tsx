import React, { useEffect, useMemo, useCallback, useRef } from "react"
import { AST } from "@/parser"
import {
  GRAPH_NODE_MARGIN_VERTICAL,
  GRAPH_CHOICE_PADDING_HORIZONTAL,
} from "@/constants"
import Nodes from "./nodes"
import StartConnect from "./start-connect"
import EndConnect from "./end-connect"
type Props = {
  index: number
  x: number
  y: number
  minimum: boolean
  node: AST.ChoiceNode
  selected: boolean
  selectedIds: string[]
  onLayout: (index: number, layout: [number, number]) => void
}

const ChoiceNode = React.memo(
  ({ index, x, y, minimum, node, selectedIds, onLayout }: Props) => {
    const { id, branches } = node
    const unLayoutedCount = useRef(branches.length)
    const layout = useRef<[number, number]>([0, 0])
    const layouts = useRef<[number, number][]>([])

    const rects = useMemo(() => {
      let curY = y
      return new Array(branches.length).fill(0).map((_, index) => {
        if (!layouts.current[index]) {
          return { x: 0, y: 0, width: 0, height: 0 }
        }
        const [width, height] = layouts.current[index]
        const nodeX = x + (layout.current[0] - width) / 2
        const nodeY = curY
        curY += height + GRAPH_NODE_MARGIN_VERTICAL
        return { width, height, x: nodeX, y: nodeY }
      })
    }, [branches, x, y])

    const handleNodeLayout = useCallback(
      (branchIndex: number, branchLayout: [number, number]) => {
        layouts.current[branchIndex] = branchLayout
        unLayoutedCount.current--
        if (unLayoutedCount.current === 0) {
          const [width, height] = layouts.current.reduce(
            ([width, height], [nodesWidth, nodesHeight]) => [
              Math.max(width, nodesWidth + 2 * GRAPH_CHOICE_PADDING_HORIZONTAL),
              height + nodesHeight,
            ],
            [0, (layouts.current.length - 1) * GRAPH_NODE_MARGIN_VERTICAL]
          )
          onLayout(index, [width, height])
          layout.current = [width, height]
        }
      },
      [index, onLayout]
    )
    return (
      <>
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
                start={[x, y + layout.current[1] / 2]}
                end={[nodeX, nodeY + nodeHeight / 2]}
              />
              <Nodes
                id={id}
                key={index}
                index={index}
                x={nodeX}
                y={nodeY}
                minimum={minimum}
                nodes={branch}
                selectedIds={selectedIds}
                onLayout={handleNodeLayout}
              />
              <EndConnect
                start={[nodeX + nodeWidth, nodeY + nodeHeight / 2]}
                end={[x + layout.current[0], y + layout.current[1] / 2]}
              />
            </React.Fragment>
          )
        })}
      </>
    )
  }
)
ChoiceNode.displayName = "ChoiceName"
export default ChoiceNode
