import React, { useMemo } from "react"
import { useAtomValue } from "jotai"
import { AST } from "@/parser"
import {
  GRAPH_NODE_MARGIN_VERTICAL,
  GRAPH_CHOICE_PADDING_VERTICAL,
} from "@/constants"
import { sizeMapAtom } from "@/atom"
import Nodes from "./nodes"
import StartConnect from "./start-connect"
import EndConnect from "./end-connect"
import Content from "./content"
import { DEFAULT_SIZE } from "./measure"

type Props = {
  x: number
  y: number
  node: AST.ChoiceNode
  selected: boolean
}

const ChoiceNode = React.memo(({ x, y, selected, node }: Props) => {
  const { id, branches } = node
  const sizeMap = useAtomValue(sizeMapAtom)

  const boxSize = useMemo(
    () => (sizeMap.get(node) || DEFAULT_SIZE).box,
    [node, sizeMap]
  )
  const rects = useMemo(() => {
    let curY = y + GRAPH_CHOICE_PADDING_VERTICAL

    return new Array(branches.length).fill(0).map((branch, index) => {
      if (!sizeMap.has(branch)) {
        return { x: 0, y: 0, width: 0, height: 0 }
      }
      const [branchWidth, branchHeight] = sizeMap.get(branch)!.box
      const nodeX = x + (boxSize[0] - branchWidth) / 2
      const nodeY = curY
      curY += branchHeight + GRAPH_NODE_MARGIN_VERTICAL
      return { width: branchWidth, height: branchHeight, x: nodeX, y: nodeY }
    })
  }, [branches, x, y, sizeMap, boxSize])

  return (
    <Content
      selected={selected}
      id={node.id}
      className="transparent-fill"
      x={x}
      y={y}
      width={boxSize[0]}
      height={boxSize[1]}
    >
      {branches.map((branch, index) => {
        const {
          x: branchX,
          y: branchY,
          width: branchWidth,
          height: branchHeight,
        } = rects[index]
        return (
          <React.Fragment key={index}>
            <StartConnect
              start={[x, y + boxSize[1] / 2]}
              end={[branchX, branchY + branchHeight / 2]}
            />
            <Nodes
              id={id}
              key={index}
              index={index}
              x={branchX}
              y={branchY}
              nodes={branch}
            />
            <EndConnect
              start={[branchX + branchWidth, branchY + branchHeight / 2]}
              end={[x + boxSize[0], y + boxSize[1] / 2]}
            />
          </React.Fragment>
        )
      })}
    </Content>
  )
})
ChoiceNode.displayName = "ChoiceName"
export default ChoiceNode
