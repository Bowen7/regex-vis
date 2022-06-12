import React, { useMemo, useEffect, useRef, useCallback, useState } from "react"
import * as AST from "@/parser/ast"
import { GRAPH_NODE_MARGIN_HORIZONTAL } from "@/constants"
import { nodesBoxMap } from "@/atom"
import ChoiceNode from "./choice"
import SimpleNode from "./simple-node"
import GroupLikeNode from "./group-like"
import RootNode from "./root"
import MidConnect from "./mid-connect"
import { withNameQuantifier } from "./with-name-quantifier"
type Props = {
  id: string
  index: number
  x: number
  y: number
  minimum: boolean
  nodes: AST.Node[]
  selectedIds: string[]
  onLayout: (index: number, layout: [number, number]) => void
}
const SimpleNodeWithNameQuantifier = withNameQuantifier(SimpleNode)
const GroupLikeNodeWithNameQuantifier = withNameQuantifier(GroupLikeNode)

const Nodes = React.memo(
  ({ id, index, x, y, minimum, nodes, selectedIds, onLayout }: Props) => {
    const unLayoutedCount = useRef(nodes.length)
    const layouts = useRef<[number, number][]>([])
    const [height, setHeight] = useState(0)

    const hasRoot = nodes[0]?.type === "root"

    const boxes = useMemo(() => {
      let curX = x
      return new Array(nodes.length).fill(0).map((_, index) => {
        if (!layouts.current[index]) {
          return { x1: 0, y1: 0, x2: 0, y2: 0 }
        }
        const [nodeWidth, nodeHeight] = layouts.current[index]
        const nodeX = curX
        const nodeY = y + (height - nodeHeight) / 2
        curX += nodeWidth + GRAPH_NODE_MARGIN_HORIZONTAL
        return {
          x1: nodeX,
          y1: nodeY,
          x2: nodeX + nodeWidth,
          y2: nodeY + nodeHeight,
        }
      })
    }, [height, x, y, nodes])

    useEffect(() => {
      nodesBoxMap.set(`${id}-${index}`, hasRoot ? boxes.slice(1, -1) : boxes)
    }, [index, id, hasRoot, boxes])

    const startSelectedIndex = useMemo(
      () => nodes.findIndex((node) => node.id === selectedIds[0]),
      [selectedIds, nodes]
    )

    const handleNodeLayout = useCallback(
      (nodeIndex: number, layout: [number, number]) => {
        layouts.current[nodeIndex] = layout
        unLayoutedCount.current--
        if (unLayoutedCount.current === 0) {
          const [width, height] = layouts.current.reduce(
            ([width, height], [nodeWidth, nodeHeight]) => [
              width + nodeWidth,
              Math.max(height, nodeHeight),
            ],
            [(layouts.current.length - 1) * GRAPH_NODE_MARGIN_HORIZONTAL, 0]
          )
          setHeight(height)
          onLayout(index, [width, height])
        }
      },
      [onLayout, index]
    )

    const connectY = y + height / 2

    return (
      <>
        {nodes.map((node, index) => {
          const { id } = node
          const box = boxes[index]
          const selected =
            startSelectedIndex >= 0 &&
            index >= startSelectedIndex &&
            index < startSelectedIndex + selectedIds.length
          let Node: JSX.Element = <></>
          switch (node.type) {
            case "choice":
              Node = (
                <ChoiceNode
                  index={index}
                  x={box.x1}
                  y={box.y1}
                  minimum={minimum}
                  node={node}
                  selected={selected}
                  selectedIds={selectedIds}
                  onLayout={handleNodeLayout}
                />
              )
              break
            case "group":
            case "lookAroundAssertion":
              Node = (
                <GroupLikeNodeWithNameQuantifier
                  index={index}
                  x={box.x1}
                  y={box.y1}
                  minimum={minimum}
                  node={node}
                  selected={selected}
                  selectedIds={selectedIds}
                  onLayout={handleNodeLayout}
                />
              )
              break
            case "root":
              Node = (
                <RootNode
                  index={index}
                  x={box.x1}
                  y={box.y1}
                  selected={selected}
                  onLayout={handleNodeLayout}
                />
              )
              break
            default:
              Node = (
                <SimpleNodeWithNameQuantifier
                  index={index}
                  x={box.x1}
                  y={box.y1}
                  node={node}
                  selected={selected}
                  onLayout={handleNodeLayout}
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
  }
)
Nodes.displayName = "Nodes"

export default Nodes
