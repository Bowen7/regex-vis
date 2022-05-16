import React, { useMemo, useEffect, useCallback } from "react"
import { useImmer } from "use-immer"
import * as AST from "@/parser/ast"
import ChoiceNode from "./choice"
import SimpleNode from "./simple-node"
type Props = {
  index: number
  x: number
  y: number
  nodes: AST.Node[]
  onLayout: (index: number, width: number, height: number) => void
}
const EMPTY_MAP = new Map<string, [number, number]>()

const Nodes: React.FC<Props> = ({ index, x, y, nodes, onLayout }) => {
  console.log(nodes)
  const [layoutMap, setLayoutMap] = useImmer(EMPTY_MAP)
  const [width, height] = useMemo(() => {
    const layouts = Array.from(layoutMap.values())
    return layouts.reduce(
      ([width, height], [nodeWidth, nodeHeight]) => [
        width + nodeWidth,
        Math.max(height, nodeHeight),
      ],
      [0, 0]
    )
  }, [layoutMap])

  const nodeXs = useMemo(() => {
    if (layoutMap.size !== nodes.length) {
      return new Array(nodes.length).fill(x)
    }
    let curX = x - layoutMap.get(nodes[0].id)![0]
    return nodes.map(({ id }) => (curX += layoutMap.get(id)![0]))
  }, [x, layoutMap, nodes])

  useEffect(() => {
    onLayout(index, width, height)
    return () => onLayout(index, 0, 0)
  }, [index, width, height, onLayout])

  const handleNodeLayout = useCallback(
    (id: string, width: number, height: number) => {
      if (width === 0 && height === 0) {
        setLayoutMap((draft) => {
          draft.delete(id)
        })
      } else {
        setLayoutMap((draft) => {
          draft.set(id, [width, height])
        })
      }
    },
    [setLayoutMap]
  )

  return (
    <>
      {nodes.map((node, index) => {
        const { id } = node
        switch (node.type) {
          case "choice":
            return (
              <ChoiceNode
                key={id}
                x={nodeXs[index]}
                y={0}
                node={node}
                onLayout={handleNodeLayout}
              />
            )
          case "group":
          case "lookAroundAssertion":
            return null
          case "root":
            return null
          default:
            return (
              <SimpleNode
                key={id}
                x={nodeXs[index]}
                y={0}
                node={node}
                onLayout={handleNodeLayout}
              />
            )
        }
      })}
    </>
  )
}
export default Nodes
