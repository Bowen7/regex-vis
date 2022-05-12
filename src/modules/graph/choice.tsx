import React, { useEffect, useMemo, useCallback } from "react"
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
  const [layouts, setLayouts] = useImmer<[number, number][]>([])
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
  }, [node.id, width, height, onLayout])

  const nodesYArray = useMemo(() => {
    let nodesY = y - layouts.length > 0 ? layouts[0][1] : 0
    return layouts.map(([, nodesHeight]) => (nodesY += nodesHeight))
  }, [y, layouts])

  const { branches } = node

  const handleNodeLayout = useCallback(
    (index: number, width: number, height: number) => {
      if (width === 0 && height === 0) {
        setLayouts((draft) => draft.splice(index, 1))
      } else {
        setLayouts((draft) => draft.splice(index, 1, [width, height]))
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
          y={nodesYArray[index]}
          nodes={branch}
          onLayout={handleNodeLayout}
        />
      ))}
    </>
  )
}
export default ChoiceNode
