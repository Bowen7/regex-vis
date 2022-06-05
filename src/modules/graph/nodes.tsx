import React, { useMemo, useEffect, useCallback } from "react"
import { useImmer } from "use-immer"
import { useUnmount } from "react-use"
import * as AST from "@/parser/ast"
import { GRAPH_NODE_MARGIN_HORIZONTAL } from "@/constants"
import ChoiceNode from "./choice"
import SimpleNode from "./simple-node"
import GroupLikeNode from "./group-like"
import RootNode from "./root"
import MidConnect from "./mid-connect"
import { withNameQuantifier } from "./with-name-quantifier"
type Props = {
  index: number
  x: number
  y: number
  nodes: AST.Node[]
  onLayout: (index: number, layout: [number, number]) => void
}
const SimpleNodeWithNameQuantifier = withNameQuantifier(SimpleNode)

const Nodes: React.FC<Props> = React.memo(
  ({ index, x, y, nodes, onLayout }) => {
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

    const nodeXs = useMemo(() => {
      if (layouts.length === 0) {
        return []
      }
      let curX = x
      return layouts.map(([width], index) => {
        const nodeX = curX
        curX += width + GRAPH_NODE_MARGIN_HORIZONTAL
        return nodeX
      })
    }, [x, layouts])

    useEffect(
      () => onLayout(index, [width, height]),
      [index, width, height, onLayout]
    )

    useUnmount(() => onLayout(index, [-1, -1]))

    const handleNodeLayout = useCallback(
      (index: number, [width, height]: [number, number]) => {
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

    const connectY = y + height / 2

    return (
      <>
        {nodes.map((node, index) => {
          const { id } = node
          const nodeX = nodeXs.length > index ? nodeXs[index] : x
          const nodeY =
            y + (height - (layouts.length > index ? layouts[index][1] : 0)) / 2
          let Node: JSX.Element = <></>
          switch (node.type) {
            case "choice":
              Node = (
                <ChoiceNode
                  index={index}
                  x={nodeX}
                  y={nodeY}
                  node={node}
                  onLayout={handleNodeLayout}
                />
              )
              break
            case "group":
            case "lookAroundAssertion":
              Node = (
                <GroupLikeNode
                  index={index}
                  x={nodeX}
                  y={nodeY}
                  node={node}
                  onLayout={handleNodeLayout}
                />
              )
              break
            case "root":
              Node = (
                <RootNode
                  index={index}
                  x={nodeX}
                  y={nodeY}
                  onLayout={handleNodeLayout}
                />
              )
              break
            default:
              Node = (
                <SimpleNodeWithNameQuantifier
                  index={index}
                  x={nodeX}
                  y={nodeY}
                  node={node}
                  onLayout={handleNodeLayout}
                />
              )
          }
          const Connect = index >= 1 && (
            <MidConnect
              start={[nodeX - GRAPH_NODE_MARGIN_HORIZONTAL, connectY]}
              end={[nodeX, connectY]}
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
