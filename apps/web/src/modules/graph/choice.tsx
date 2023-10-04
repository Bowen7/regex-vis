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
  const boxes = useMemo(() => {
    let curY = y + GRAPH_CHOICE_PADDING_VERTICAL

    return branches.map((branch) => {
      if (!sizeMap.has(branch)) {
        return { x: 0, y: 0, width: 0, height: 0 }
      }

      const [branchWidth, branchHeight] = sizeMap.get(branch)!.box
      const branchX = x + (boxSize[0] - branchWidth) / 2
      const branchY = curY
      curY += branchHeight + GRAPH_NODE_MARGIN_VERTICAL
      return {
        width: branchWidth,
        height: branchHeight,
        x: branchX,
        y: branchY,
      }
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
        } = boxes[index]
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
