import React, { useEffect, useMemo, useState, useCallback } from "react"
import { useImmer } from "use-immer"
import { AST } from "@/parser"
import Nodes from "./nodes"
type Props = {
  index: number
  x: number
  y: number
  node: AST.ChoiceNode
  onLayout: (index: number, width: number, height: number) => void
}
const MARGIN_VERTICAL = 15

const ChoiceNode: React.FC<Props> = React.memo(
  ({ index, x, y, node, onLayout }) => {
    const { branches } = node
    const [layouts, setLayouts] = useImmer<[number, number][]>([])
    const [width, height] = useMemo(
      () =>
        layouts.reduce(
          ([width, height], [nodesWidth, nodesHeight]) => [
            Math.max(width, nodesWidth),
            height + nodesHeight,
          ],
          [0, (layouts.length - 1) * MARGIN_VERTICAL]
        ),
      [layouts]
    )

    useEffect(() => {
      onLayout(index, width, height)
      return () => onLayout(index, -1, -1)
    }, [index, width, height, onLayout])

    const branchYs = useMemo(() => {
      if (layouts.length === 0) {
        return []
      }
      let curY = y - layouts[0][1]
      return layouts.map(
        ([, nodesHeight], index) =>
          (curY += nodesHeight + index * MARGIN_VERTICAL)
      )
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
          const nodeX =
            x + (width - (layouts.length > index ? layouts[index][0] : 0)) / 2
          return (
            <Nodes
              key={index}
              index={index}
              x={nodeX}
              y={branchYs.length > index ? branchYs[index] : y}
              nodes={branch}
              onLayout={handleNodeLayout}
            />
          )
        })}
      </>
    )
  }
)
export default ChoiceNode
