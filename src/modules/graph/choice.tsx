import React, { useEffect, useMemo, useState, useCallback } from "react"
import { useImmer } from "use-immer"
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
  node: AST.ChoiceNode
  onLayout: (index: number, width: number, height: number) => void
}

const ChoiceNode: React.FC<Props> = React.memo(
  ({ index, x, y, node, onLayout }) => {
    const { branches } = node
    const [layouts, setLayouts] = useImmer<[number, number][]>([])
    const [width, height] = useMemo(
      () =>
        layouts.reduce(
          ([width, height], [nodesWidth, nodesHeight]) => [
            Math.max(width, nodesWidth + 2 * GRAPH_CHOICE_PADDING_HORIZONTAL),
            height + nodesHeight,
          ],
          [0, (layouts.length - 1) * GRAPH_NODE_MARGIN_VERTICAL]
        ),
      [layouts]
    )
    console.log(width)

    useEffect(() => {
      onLayout(index, width, height)
      return () => onLayout(index, -1, -1)
    }, [index, width, height, onLayout])

    const branchYs = useMemo(() => {
      if (layouts.length === 0) {
        return []
      }
      let curY = y
      return layouts.map(([, height], index) => {
        const nodeY = curY
        curY += height + GRAPH_NODE_MARGIN_VERTICAL
        return nodeY
      })
    }, [y, layouts])

    const handleNodeLayout = useCallback(
      (index: number, width: number, height: number) => {
        if (width === -1 && height === -1) {
          setLayouts((draft) => {
            draft.splice(index, 1)
          })
        } else {
          setLayouts((draft) => {
            draft[index] = [width, height]
          })
        }
      },
      [setLayouts]
    )
    return (
      <>
        {branches.map((branch, index) => {
          const nodeWidth = layouts.length > index ? layouts[index][0] : 0
          const nodeHeight = layouts.length > index ? layouts[index][1] : 0
          const nodeX = x + (width - nodeWidth) / 2
          const nodeY = branchYs.length > index ? branchYs[index] : y
          return (
            <>
              <StartConnect
                start={[x, y + height / 2]}
                end={[nodeX, nodeY + nodeHeight / 2]}
              />
              <Nodes
                key={index}
                index={index}
                x={nodeX}
                y={branchYs.length > index ? branchYs[index] : y}
                nodes={branch}
                onLayout={handleNodeLayout}
              />
              <EndConnect
                start={[nodeX + nodeWidth, nodeY + nodeHeight / 2]}
                end={[x + width, y + height / 2]}
              />
            </>
          )
        })}
      </>
    )
  }
)
export default ChoiceNode
