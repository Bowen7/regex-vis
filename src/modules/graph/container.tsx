import React, { useState, useCallback } from "react"
import { AST } from "@/parser"
import Nodes from "./nodes"

type Props = {
  ast: AST.Regex
  minimum?: boolean
}
const Container: React.FC<Props> = React.memo(({ ast }) => {
  const [layout, setLayout] = useState<[number, number]>([0, 0])
  const handleLayout = useCallback(
    (index: number, width: number, height: number) => {
      setLayout([width, height])
    },
    [setLayout]
  )
  return (
    <svg
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      width={layout[0]}
      height={layout[1]}
    >
      <Nodes
        index={0}
        x={0}
        y={0}
        nodes={ast.body}
        onLayout={handleLayout}
      ></Nodes>
    </svg>
  )
})

export default Container
