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
const MARGIN_HORIZONTAL = 25

const Nodes: React.FC<Props> = React.memo(
  ({ index, x, y, nodes, onLayout }) => {
    const [layouts, setLayouts] = useImmer<[number, number][]>([])
    const [width, height] = useMemo(() => {
      return layouts.reduce(
        ([width, height], [nodeWidth, nodeHeight]) => [
          width + nodeWidth,
          Math.max(height, nodeHeight),
        ],
        [(layouts.length - 1) * MARGIN_HORIZONTAL, 0]
      )
    }, [layouts])

    const nodeXs = useMemo(() => {
      if (layouts.length === 0) {
        return []
      }
      let curX = x - layouts[0]![0]
      return layouts.map(
        ([width], index) => (curX += width + index * MARGIN_HORIZONTAL)
      )
    }, [x, layouts])

    useEffect(() => {
      onLayout(index, width, height)
      return () => onLayout(index, -1, -1)
    }, [index, width, height, onLayout])

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
        {nodes.map((node, index) => {
          const { id } = node
          const nodeX = nodeXs.length > index ? nodeXs[index] : x
          const nodeY =
            y + (height - (layouts.length > index ? layouts[index][1] : 0)) / 2
          switch (node.type) {
            case "choice":
              return (
                <ChoiceNode
                  key={id}
                  index={index}
                  x={nodeX}
                  y={nodeY}
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
                  index={index}
                  x={nodeX}
                  y={nodeY}
                  node={node}
                  onLayout={handleNodeLayout}
                />
              )
          }
        })}
      </>
    )
  }
)
export default Nodes
