import { useTranslation } from "react-i18next"
import { AST } from "@/parser"
import {
  GRAPH_QUANTIFIER_TEXT_FONTSIZE,
  GRAPH_NAME_TEXT_FONTSIZE,
  GRAPH_QUANTIFIER_HEIGHT,
  GRAPH_NAME_HEIGHT,
} from "@/constants"
import QuantifierNode from "./quantifier"
import MidConnect from "./mid-connect"
import { getQuantifier, getNameText } from "./utils"
import { NodeSize } from "./measure"

type Props = { node: AST.Node; x: number; y: number; size: NodeSize }
//    name
//  --------
// | content |
//  --------
//  quantifier
export const NameAndQuantifier = (props: Props) => {
  const { t } = useTranslation()
  const { x, y, node, size } = props
  const quantifier = getQuantifier(node)
  const name = getNameText(node, t)
  const { box: boxSize, content: contentSize } = size

  const contentX = x + (boxSize[0] - contentSize[0]) / 2
  const contentY = y + (boxSize[1] - contentSize[1]) / 2
  const centerY = y + boxSize[1] / 2
  return (
    <>
      {contentX !== x && (
        <>
          <MidConnect start={[x, centerY]} end={[contentX, centerY]} />
          <MidConnect
            start={[contentX + contentSize[0], centerY]}
            end={[x + boxSize[0], centerY]}
          />
        </>
      )}
      {name && (
        <foreignObject
          x={x}
          y={contentY - GRAPH_NAME_TEXT_FONTSIZE * 1.5}
          width={boxSize[0]}
          height={GRAPH_NAME_HEIGHT}
          fontSize={GRAPH_NAME_TEXT_FONTSIZE}
        >
          <div className="text">{name}</div>
        </foreignObject>
      )}
      {quantifier && (
        <foreignObject
          x={x}
          y={contentY + contentSize[1]}
          width={boxSize[0]}
          height={GRAPH_QUANTIFIER_HEIGHT}
          fontSize={GRAPH_QUANTIFIER_TEXT_FONTSIZE}
        >
          <QuantifierNode quantifier={quantifier} />
        </foreignObject>
      )}
    </>
  )
}
