import React, { useEffect, useRef } from "react"
import { useTheme } from "@geist-ui/core"
import { GeistUIThemesPalette } from "@geist-ui/core/esm/themes"
import { useTranslation, TFunction } from "react-i18next"
import { AST, characterClassTextMap, CharacterClassKey } from "@/parser"
import {
  GRAPH_TEXT_FONT_SIZE,
  GRAPH_TEXT_LIEN_HEIGHT,
  GRAPH_NODE_PADDING_VERTICAL,
} from "@/constants"
type Props = {
  x: number
  y: number
  node:
    | AST.CharacterNode
    | AST.BackReferenceNode
    | AST.BeginningBoundaryAssertionNode
    | AST.EndBoundaryAssertionNode
    | AST.WordBoundaryAssertionNode
  onLayout: (layout: [number, number]) => void
}

const commonTextProps = {
  textAnchor: "middle",
  fontSize: GRAPH_TEXT_FONT_SIZE,
}

const assertionTextMap = {
  beginning: "Begin with",
  end: "End with",
  lookahead: ["Followed by:", "Not followed by"],
  lookbehind: ["Preceded by", "Not Preceded by"],
  word: ["WordBoundary", "NonWordBoundary"],
}

const renderString = (value: string, palette: GeistUIThemesPalette, dy = 0) => (
  <text fill={palette.foreground} dy={dy} {...commonTextProps}>
    <tspan fill={palette.accents_4}>{'" '}</tspan>
    <tspan>{value}</tspan>
    <tspan fill={palette.accents_4}>{' "'}</tspan>
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
      <text fill={palette.foreground} {...commonTextProps}>
        {t(characterClassTextMap[node.value as CharacterClassKey])}
      </text>
    )
  } else {
    return renderString(node.value, palette)
  }
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
  let dy = 0
  ranges.forEach(({ from, to }) => {
    if (from.length === 1) {
      if (from === to) {
        singleRangeSet.add(from)
      } else {
        texts.push(
          <text fill={palette.foreground} dy={dy} {...commonTextProps}>
            <tspan fill={palette.accents_4}>{'" '}</tspan>
            <tspan>{from}</tspan>
            <tspan fill={palette.accents_4}>{' "'}</tspan>
            <tspan fill={palette.accents_4}>{" - "}</tspan>
            <tspan fill={palette.accents_4}>{'" '}</tspan>
            <tspan>{to}</tspan>
            <tspan fill={palette.accents_4}>{' "'}</tspan>
          </text>
        )
        dy += GRAPH_TEXT_LIEN_HEIGHT
      }
    } else if (from === to) {
      texts.push(
        <text fill={palette.foreground} dy={dy} {...commonTextProps}>
          {getRangeText(from)}
        </text>
      )
      dy += GRAPH_TEXT_LIEN_HEIGHT
    } else {
      texts.push(
        <text dy={dy} fill={palette.foreground} {...commonTextProps}>
          <tspan>{getRangeText(from)}</tspan>
          <tspan fill={palette.accents_4}>{" - "}</tspan>
          <tspan>{getRangeText(to)}</tspan>
        </text>
      )
      dy += GRAPH_TEXT_LIEN_HEIGHT
    }
  })
  if (singleRangeSet.size > 0) {
    const text = Array.from(singleRangeSet).join("")
    texts.push(renderString(text, palette, dy))
  }
  return <>{texts}</>
}

const renderBackReference = (
  node: AST.BackReferenceNode,
  palette: GeistUIThemesPalette,
  t: TFunction
) => {
  const string = `${t("Back reference")} #${node.ref}`
  return (
    <text fill={palette.foreground} {...commonTextProps}>
      {string}
    </text>
  )
}

const renderBoundaryAssertion = (
  node:
    | AST.BeginningBoundaryAssertionNode
    | AST.EndBoundaryAssertionNode
    | AST.WordBoundaryAssertionNode,
  palette: GeistUIThemesPalette,
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
  return (
    <text fill={palette.foreground} {...commonTextProps}>
      {string}
    </text>
  )
}

const Text: React.FC<Props> = React.memo(({ x, y, node, onLayout }) => {
  const gRef = useRef<SVGGElement>(null)

  const { palette } = useTheme()
  const { t } = useTranslation()

  useEffect(() => {
    const { width, height } = gRef.current?.getBoundingClientRect()!
    onLayout([width, height])
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
        return renderBackReference(node, palette, t)
      case "boundaryAssertion":
        return renderBoundaryAssertion(node, palette, t)
    }
  }

  return (
    <g
      ref={gRef}
      fontSize={GRAPH_TEXT_FONT_SIZE}
      transform={`translate(${x},${
        GRAPH_TEXT_FONT_SIZE + GRAPH_NODE_PADDING_VERTICAL
      })`}
    >
      {renderText()}
    </g>
  )
})

export default Text
