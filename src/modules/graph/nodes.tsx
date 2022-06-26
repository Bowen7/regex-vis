import React, { useMemo, useEffect, useRef, useCallback, useState } from "react"
import { useAtomValue } from "jotai"
import * as AST from "@/parser/ast"
import { GRAPH_NODE_MARGIN_HORIZONTAL } from "@/constants"
import { nodesBoxMap, selectedIdsAtom, recordLayoutEnableAtom } from "@/atom"
import ChoiceNode from "./choice"
import SimpleNode from "./simple-node"
import GroupLikeNode from "./group-like"
import RootNode from "./root"
import MidConnect from "./mid-connect"
type Props = {
  id: string
  index: number
  x: number
  y: number
  nodes: AST.Node[]
  onLayout: (index: number, layout: [number, number]) => void
}

const Nodes = React.memo(({ id, index, x, y, nodes, onLayout }: Props) => {
  const layoutCount = useRef(0)
  const layoutsRef = useRef<[number, number][]>([])
  const [layouts, setLayouts] = useState<[number, number][]>([])
  const [height, setHeight] = useState(0)
  const selectedIds = useAtomValue(selectedIdsAtom)
  const recordLayoutEnable = useAtomValue(recordLayoutEnableAtom)

  const hasRoot = nodes[0]?.type === "root"

  const boxes = useMemo(() => {
    let curX = x
    return new Array(nodes.length).fill(0).map((_, index) => {
      if (!layouts[index]) {
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
  }, [height, x, y, nodes, layouts])

  useEffect(() => {
    if (recordLayoutEnable) {
      nodesBoxMap.set(`${id}-${index}`, hasRoot ? boxes.slice(1, -1) : boxes)
    }
    return () => {
      nodesBoxMap.delete(`${id}-${index}`)
    }
  }, [index, id, hasRoot, boxes, recordLayoutEnable])

  const startSelectedIndex = useMemo(
    () => nodes.findIndex((node) => node.id === selectedIds[0]),
    [selectedIds, nodes]
  )

  const handleNodeLayout = useCallback(
    (nodeIndex: number, layout: [number, number]) => {
      layoutsRef.current[nodeIndex] = layout
      layoutCount.current++
      if (layoutCount.current % nodes.length === 0) {
        const [width, height] = layoutsRef.current.reduce(
          ([width, height], [nodeWidth, nodeHeight]) => [
            width + nodeWidth,
            Math.max(height, nodeHeight),
          ],
          [(layoutsRef.current.length - 1) * GRAPH_NODE_MARGIN_HORIZONTAL, 0]
        )
        setHeight(height)
        onLayout(index, [width, height])
        setLayouts(layoutsRef.current.slice())
      }
    },
    [onLayout, nodes.length, index]
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
                node={node}
                selected={selected}
                onLayout={handleNodeLayout}
              />
            )
            break
          case "group":
          case "lookAroundAssertion":
            Node = (
              <GroupLikeNode
                index={index}
                x={box.x1}
                y={box.y1}
                node={node}
                selected={selected}
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
              <SimpleNode
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
})
Nodes.displayName = "Nodes"

export default Nodes
