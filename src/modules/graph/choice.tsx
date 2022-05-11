import React, { useMemo } from "react"
import { useImmer } from "use-immer"
import { AST } from "@/parser"
import Nodes from "./nodes"
type Props = {
  x: number
  y: number
  node: AST.ChoiceNode
  onLayout: (width: number, height: number) => void
}
const ChoiceNode: React.FC<Props> = ({ node, onLayout }) => {
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
  const { branches } = node

  const handleNodeLayout = (index: number, width: number, height: number) => {
    if (width === 0 && height === 0) {
      setLayouts((draft) => draft.splice(index, 1))
    } else {
      setLayouts((draft) => draft.splice(index, 1, [width, height]))
    }
  }
  return (
    <>
      {branches.map((branch, index) => (
        <Nodes
          x={0}
          y={0}
          nodes={branch}
          onLayout={(width, height) => handleNodeLayout(index, width, height)}
        />
      ))}
    </>
  )
}
export default ChoiceNode
