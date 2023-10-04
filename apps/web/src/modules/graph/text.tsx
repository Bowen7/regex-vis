import React, { Fragment } from "react"
import { useTranslation, TFunction } from "react-i18next"
import { AST, characterClassTextMap, CharacterClassKey } from "@/parser"
type Props = {
  node:
    | AST.CharacterNode
    | AST.BackReferenceNode
    | AST.BeginningBoundaryAssertionNode
    | AST.EndBoundaryAssertionNode
    | AST.WordBoundaryAssertionNode
}

const assertionTextMap = {
  beginning: "Begin with",
  end: "End with",
  lookahead: ["Followed by:", "Not followed by:"],
  lookbehind: ["Preceded by:", "Not Preceded by:"],
  word: ["WordBoundary", "NonWordBoundary"],
}

const renderString = (value: string) => (
  <div className="text">
    <span className="with-quote">{value}</span>
  </div>
)

const renderStringCharacter = (node: AST.StringCharacterNode) =>
  renderString(node.value)

const renderClassCharacter = (value: string, t: TFunction) => {
  if (value === "") {
    return <span className="second-text">{t("Empty")}</span>
  } else if (value in characterClassTextMap) {
    return <span>{t(characterClassTextMap[value as CharacterClassKey])}</span>
  } else {
    return <span className="with-quote">{value}</span>
  }
}

const renderRangesCharacter = (node: AST.RangesCharacterNode, t: TFunction) => {
  const singleRangeSet = new Set<string>()
  const ranges = node.ranges
  const texts: JSX.Element[] = []
  ranges.forEach(({ from, to }, index) => {
    if (from.length === 1) {
      if (from === to) {
        singleRangeSet.add(from)
      } else {
        texts.push(
          <div className="text" key={index}>
            <span className="with-quote">{from}</span>
            <span className="second-text">{" - "}</span>
            <span className="with-quote">{to}</span>
          </div>
        )
      }
    } else if (from === to) {
      texts.push(
        <div className="text" key={index}>
          {renderClassCharacter(from, t)}
        </div>
      )
    } else {
      texts.push(
        <div className="text" key={index}>
          {renderClassCharacter(from, t)}
          <span className="second-text">{" - "}</span>
          {renderClassCharacter(to, t)}
        </div>
      )
    }
  })
  if (singleRangeSet.size > 0) {
    const text = Array.from(singleRangeSet).join("")
    texts.push(<Fragment key="single-range">{renderString(text)}</Fragment>)
  }
  return <>{texts}</>
}

const renderBackReference = (node: AST.BackReferenceNode, t: TFunction) => {
  const string = `${t("Back reference")} #${node.ref}`
  return <div className="text">{string}</div>
}

const renderBoundaryAssertion = (
  node:
    | AST.BeginningBoundaryAssertionNode
    | AST.EndBoundaryAssertionNode
    | AST.WordBoundaryAssertionNode,
  t: TFunction
) => {
  let string = ""
  if (node.kind === "word") {
    const negate = node.negate
    string = assertionTextMap.word[negate ? 1 : 0]
  } else {
    const kind = node.kind
    string = assertionTextMap[kind]
  }
  string = t(string)
  return <div className="text">{string}</div>
}

const TextNode = React.memo(({ node }: Props) => {
  const { t } = useTranslation()

  switch (node.type) {
    case "character":
      switch (node.kind) {
        case "string":
          if (node.value === "") {
            return <div className="second-text">{t("Empty")}</div>
          }
          return renderStringCharacter(node)
        case "class":
          return (
            <div className="text">{renderClassCharacter(node.value, t)}</div>
          )
        case "ranges":
          return renderRangesCharacter(node, t)
        default:
          break
      }
      return null
    case "backReference":
      return renderBackReference(node, t)
    case "boundaryAssertion":
      return renderBoundaryAssertion(node, t)
  }
})

TextNode.displayName = "TextNode"
export default TextNode
