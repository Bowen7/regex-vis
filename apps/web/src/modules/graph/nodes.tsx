import React, { useMemo, useEffect, ReactNode } from "react"
import { useAtomValue } from "jotai"
import * as AST from "@/parser/ast"
import { GRAPH_NODE_MARGIN_HORIZONTAL } from "@/constants"
import {
  nodesBoxMap,
  selectedIdsAtom,
  isPrimaryGraphAtom,
  sizeMapAtom,
} from "@/atom"
import ChoiceNode from "./choice"
import SimpleNode from "./simple-node"
import GroupLikeNode from "./group-like"
import MidConnect from "./mid-connect"
import { DEFAULT_SIZE } from "./measure"
import { useSize } from "./utils"
type Props = {
  id: string
  index: number
  x: number
  y: number
  nodes: AST.Node[]
}

const Nodes = React.memo(({ id, index, x, y, nodes }: Props) => {
  const sizeMap = useAtomValue(sizeMapAtom)
  const selectedIds = useAtomValue(selectedIdsAtom)
  const isPrimaryGraph = useAtomValue(isPrimaryGraphAtom)
  const [, boxHeight] = useSize(nodes, sizeMap).box

  const boxes = useMemo(() => {
    let curX = x
    return nodes.map((node, index) => {
      const [nodeWidth, nodeHeight] = (sizeMap.get(node) || DEFAULT_SIZE).box
      const nodeX = curX
      const nodeY = y + (boxHeight - nodeHeight) / 2
      curX += nodeWidth + GRAPH_NODE_MARGIN_HORIZONTAL
      return {
        x1: nodeX,
        y1: nodeY,
        x2: nodeX + nodeWidth,
        y2: nodeY + nodeHeight,
      }
    })
  }, [boxHeight, x, y, nodes, sizeMap])

  const contentBoxes = useMemo(() => {
    let curX = x
    return nodes.map((node, index) => {
      const { box: boxSize, content: contentSize } =
        sizeMap.get(node) || DEFAULT_SIZE
      const nodeX = curX + (boxSize[0] - contentSize[0]) / 2
      const nodeY = y + (boxHeight - contentSize[1]) / 2
      curX += boxSize[0] + GRAPH_NODE_MARGIN_HORIZONTAL
      return {
        x1: nodeX,
        y1: nodeY,
        x2: nodeX + contentSize[0],
        y2: nodeY + contentSize[1],
      }
    })
  }, [boxHeight, x, y, nodes, sizeMap])

  useEffect(() => {
    if (isPrimaryGraph) {
      nodesBoxMap.set(`${id}-${index}`, contentBoxes)
    }
    return () => {
      nodesBoxMap.delete(`${id}-${index}`)
    }
  }, [index, id, contentBoxes, isPrimaryGraph])

  const startSelectedIndex = useMemo(
    () => nodes.findIndex((node) => node.id === selectedIds[0]),
    [selectedIds, nodes]
  )

  const connectY = y + boxHeight / 2

  return (
    <>
      {nodes.map((node, index) => {
        const { id } = node
        const box = boxes[index]
        const selected =
          startSelectedIndex >= 0 &&
          index >= startSelectedIndex &&
          index < startSelectedIndex + selectedIds.length
        let Node: ReactNode = <></>
        switch (node.type) {
          case "choice":
            Node = (
              <ChoiceNode
                x={box.x1}
                y={box.y1}
                node={node}
                selected={selected}
              />
            )
            break
          case "group":
          case "lookAroundAssertion":
            Node = (
              <GroupLikeNode
                x={box.x1}
                y={box.y1}
                node={node}
                selected={selected}
              />
            )
            break
          case "root":
            Node = null
            break
          default:
            Node = (
              <SimpleNode
                x={box.x1}
                y={box.y1}
                node={node}
                selected={selected}
              />
            )
        }
        const Connect = index >= 1 && (
          <MidConnect
            start={[box.x1 - GRAPH_NODE_MARGIN_HORIZONTAL, connectY]}
            end={[box.x1, connectY]}
          />
        )
        return (
          <React.Fragment key={id}>
            {Connect}
            {Node}
          </React.Fragment>
        )
      })}
    </>
  )
})
Nodes.displayName = "Nodes"

export default Nodes
