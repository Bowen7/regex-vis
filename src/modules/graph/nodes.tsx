import React, { useMemo, useEffect, useCallback } from "react"
import { useImmer } from "use-immer"
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
    const [layouts, setLayouts] = useImmer<[number, number][]>([])
    const [width, height] = useMemo(() => {
      return layouts.reduce(
        ([width, height], [nodeWidth, nodeHeight]) => [
          width + nodeWidth,
          Math.max(height, nodeHeight),
        ],
        [(layouts.length - 1) * GRAPH_NODE_MARGIN_HORIZONTAL, 0]
      )
    }, [layouts])

    const boxes = useMemo(() => {
      let curX = x
      return new Array(nodes.length).fill(0).map((_, index) => {
        if (index >= layouts.length) {
          return { x1: 0, y1: 0, x2: 0, y2: 0 }
        }
        const [nodeWidth, nodeHeight] = layouts[index]
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
    }, [layouts, height, x, y, nodes.length])

    useEffect(() => {
      nodesBoxMap.set(`${id}-${index}`, boxes)
    }, [index, id, boxes])

    useEffect(
      () => onLayout(index, [width, height]),
      [index, width, height, onLayout]
    )

    const startSelectedIndex = useMemo(
      () => nodes.findIndex((node) => node.id === selectedIds[0]),
      [selectedIds, nodes]
    )

    const handleNodeLayout = useCallback(
      (index: number, [width, height]: [number, number]) => {
        setLayouts((draft) => {
          draft[index] = [width, height]
        })
      },
      [setLayouts]
    )

    const connectY = y + height / 2

    return (
      <>
        {nodes.map((node, index) => {
          const { id } = node
          const box = boxes[index]
          const nodeSelected =
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
                  selected={nodeSelected}
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
                  selected={nodeSelected}
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
                  selected={nodeSelected}
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
                  selected={nodeSelected}
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
