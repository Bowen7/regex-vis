import React, { useEffect, useMemo, useState, useCallback } from "react"
import { useImmer } from "use-immer"
import { AST } from "@/parser"
import Nodes from "./nodes"
type Props = {
  x: number
  y: number
  node: AST.ChoiceNode
  onLayout: (id: string, width: number, height: number) => void
}

const ChoiceNode: React.FC<Props> = ({ x, y, node, onLayout }) => {
  const { branches } = node
  const [defaultLayouts] = useState(() =>
    new Array(branches.length).fill([0, 0])
  )
  const [layouts, setLayouts] = useImmer<[number, number][]>(defaultLayouts)
  const [width, height] = useMemo(
    () =>
      layouts.reduce(
        ([width, height], [nodesWidth, nodesHeight]) => [
          Math.max(width, nodesWidth),
          height + nodesHeight,
        ],
        [0, 0]
      ),
    [layouts]
  )

  useEffect(() => {
    onLayout(node.id, width, height)
    return () => onLayout(node.id, 0, 0)
  }, [node.id, width, height, onLayout])

  const branchYs = useMemo(() => {
    let curY = y - layouts[0][1]
    return layouts.map(([, nodesHeight]) => (curY += nodesHeight))
  }, [y, layouts])

  const handleNodeLayout = useCallback(
    (index: number, width: number, height: number) => {
      if (width === 0 && height === 0) {
        setLayouts((draft) => {
          draft.splice(index, 1)
        })
      } else {
        setLayouts((draft) => {
          draft.splice(index, 1, [width, height])
        })
      }
    },
    [setLayouts]
  )
  return (
    <>
      {branches.map((branch, index) => (
        <Nodes
          key={index}
          index={index}
          x={x + (width - layouts[index][0]) / 2}
          y={branchYs[index]}
          nodes={branch}
          onLayout={handleNodeLayout}
        />
      ))}
    </>
  )
}
export default ChoiceNode
