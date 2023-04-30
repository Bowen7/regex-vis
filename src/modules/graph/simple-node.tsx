import { useAtomValue } from "jotai"
import { AST } from "@/parser"
import { GRAPH_NODE_BORDER_RADIUS, GRAPH_TEXT_FONT_SIZE } from "@/constants"
import { sizeMapAtom } from "@/atom"
import { NameAndQuantifier } from "./name-quantifier"
import Content from "./content"
import TextNode from "./text"
import { useSize } from "./utils"

type Props = {
  x: number
  y: number
  node:
    | AST.CharacterNode
    | AST.BackReferenceNode
    | AST.BeginningBoundaryAssertionNode
    | AST.EndBoundaryAssertionNode
    | AST.WordBoundaryAssertionNode
  selected: boolean
}

const SimpleNode = ({ x, y, node, selected }: Props) => {
  const sizeMap = useAtomValue(sizeMapAtom)
  const size = useSize(node, sizeMap)
  const { box: boxSize, content: contentSize } = size
  const contentX = x + (boxSize[0] - contentSize[0]) / 2
  const contentY = y + (boxSize[1] - contentSize[1]) / 2
  const centerX = x + boxSize[0] / 2
  return (
    <>
      <NameAndQuantifier x={x} y={y} node={node} size={size} />
      <Content
        id={node.id}
        selected={selected}
        x={contentX}
        y={contentY}
        width={contentSize[0]}
        height={contentSize[1]}
        rx={GRAPH_NODE_BORDER_RADIUS}
        ry={GRAPH_NODE_BORDER_RADIUS}
        fill="transparent"
        className="stroke"
      >
        <g transform={`translate(0,${0.1 * GRAPH_TEXT_FONT_SIZE + contentY})`}>
          <TextNode centerX={centerX} node={node} />
        </g>
      </Content>
    </>
  )
}

SimpleNode.displayName = "SimpleNode"
export default SimpleNode
