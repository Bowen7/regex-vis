import React, { useEffect, useRef } from "react"
import { useTheme } from "@geist-ui/core"
import { GeistUIThemesPalette } from "@geist-ui/core/esm/themes"
import { useTranslation, TFunction } from "react-i18next"
import { AST, characterClassTextMap, CharacterClassKey } from "@/parser"
import { GRAPH_TEXT_LIEN_HEIGHT } from "@/constants"
type Props = {
  node:
    | AST.CharacterNode
    | AST.BackReferenceNode
    | AST.BeginningBoundaryAssertionNode
    | AST.EndBoundaryAssertionNode
    | AST.WordBoundaryAssertionNode
  onLayout: (width: number, height: number) => void
}

const renderString = (value: string, palette: GeistUIThemesPalette, y = 0) => (
  <text x="50%" textAnchor="middle" y={0}>
    <tspan fill={palette.accents_4}>"</tspan>
    <tspan>{value}</tspan>
    <tspan fill={palette.accents_4}>"</tspan>
  </text>
)

const renderStringCharacter = (
  node: AST.StringCharacterNode,
  palette: GeistUIThemesPalette
) => renderString(node.value, palette)

const renderClassCharacter = (
  node: AST.ClassCharacterNode,
  palette: GeistUIThemesPalette,
  t: TFunction
) => {
  if (node.value in characterClassTextMap) {
    return (
      <text>{t(characterClassTextMap[node.value as CharacterClassKey])}</text>
    )
  } else {
    return renderString(node.value, palette)
  }
}

const commonTextProps = {
  x: "50%",
  textAnchor: "middle",
  height: GRAPH_TEXT_LIEN_HEIGHT,
}
const getRangeText = (key: string) => {
  if (key in characterClassTextMap) {
    return characterClassTextMap[key as CharacterClassKey]
  } else {
    return key
  }
}
const renderRangesCharacter = (
  node: AST.RangesCharacterNode,
  palette: GeistUIThemesPalette,
  t: TFunction
) => {
  const singleRangeSet = new Set<string>()
  const ranges = node.ranges
  const texts: JSX.Element[] = []
  let y = 0
  ranges.forEach(({ from, to }) => {
    if (from.length === 1) {
      if (from === to) {
        singleRangeSet.add(from)
      } else {
        texts.push(
          <text y={y} {...commonTextProps}>
            <tspan fill={palette.accents_4}>"</tspan>
            <tspan>{from}</tspan>
            <tspan fill={palette.accents_4}>{" - "}</tspan>
            <tspan>{to}</tspan>
            <tspan fill={palette.accents_4}>"</tspan>
          </text>
        )
        y += GRAPH_TEXT_LIEN_HEIGHT
      }
    } else if (from === to) {
      texts.push(
        <text y={y} {...commonTextProps}>
          {getRangeText(from)}
        </text>
      )
      y += GRAPH_TEXT_LIEN_HEIGHT
    } else {
      texts.push(
        <text y={y} {...commonTextProps}>
          <tspan>{getRangeText(from)}</tspan>
          <tspan fill={palette.accents_4}>{" - "}</tspan>
          <tspan>{getRangeText(to)}</tspan>
        </text>
      )
      y += GRAPH_TEXT_LIEN_HEIGHT
    }
  })
  if (singleRangeSet.size > 0) {
    const text = Array.from(singleRangeSet).join("")
    texts.push(renderString(text, palette, y))
  }
  return <>{texts}</>
}

const Text: React.FC<Props> = React.memo(({ node, onLayout }) => {
  const gRef = useRef<SVGGElement>(null)

  const { palette } = useTheme()
  const { t } = useTranslation()

  useEffect(() => {
    const { width, height } = gRef.current?.getBoundingClientRect()!
    onLayout(width, height)
  }, [node, onLayout])

  const renderText = (): JSX.Element => {
    switch (node.type) {
      case "character":
        switch (node.kind) {
          case "string":
            return renderStringCharacter(node, palette)
          case "class":
            return renderClassCharacter(node, palette, t)
          case "ranges":
            return renderRangesCharacter(node, palette, t)
        }
        throw new Error("unreachable")
      case "backReference":
      case "boundaryAssertion":
        return <></>
    }
  }

  return <g ref={gRef}>{renderText()}</g>
})

export default Text
