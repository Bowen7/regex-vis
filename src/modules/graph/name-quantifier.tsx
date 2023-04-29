import { useTranslation } from "react-i18next"
import { AST } from "@/parser"
import QuantifierNode from "./quantifier"
import { NameNode } from "./name"
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
  const centerX = x + boxSize[0] / 2
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
      {name && <NameNode centerX={centerX} y={contentY} name={name} />}
      {quantifier && (
        <QuantifierNode
          centerX={centerX}
          y={contentY + contentSize[1]}
          quantifier={quantifier}
        />
      )}
    </>
  )
}
