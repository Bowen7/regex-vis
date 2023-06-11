import i18n from "@/i18n"
import { AST, characterClassTextMap, CharacterClassKey } from "@/parser"
import {
  GRAPH_ROOT_RADIUS,
  GRAPH_TEXT_FONT_SIZE,
  GRAPH_QUANTIFIER_TEXT_FONTSIZE,
  GRAPH_NODE_PADDING_VERTICAL,
  GRAPH_NODE_PADDING_HORIZONTAL,
  GRAPH_NODE_MIN_WIDTH,
  GRAPH_NODE_MIN_HEIGHT,
  REGEX_FONT_FAMILY,
  GRAPH_QUANTIFIER_MEASURE_HEIGHT,
  GRAPH_NAME_MEASURE_HEIGHT,
  GRAPH_QUOTE_PADDING,
  GRAPH_ICON_SIZE,
} from "@/constants"
import {
  tryCharacterClassText,
  getBackReferenceText,
  getBoundaryAssertionText,
  getNameText,
  getQuantifierText,
} from "./utils"

const t = i18n.t

export type NodeSize = {
  box: [number, number]
  content: [number, number]
}

const ZERO_SIZE: [number, number] = [0, 0]
const EMPTY_SIZE: [number, number] = [
  GRAPH_NODE_MIN_WIDTH,
  GRAPH_NODE_MIN_HEIGHT,
]
export const ROOT_SIZE: [number, number] = [
  GRAPH_ROOT_RADIUS * 2,
  GRAPH_ROOT_RADIUS * 2,
]
export const DEFAULT_SIZE: NodeSize = {
  box: ZERO_SIZE,
  content: ZERO_SIZE,
}

let ctx: CanvasRenderingContext2D | null = null

try {
  const canvas = document.createElement("canvas")
  ctx = canvas.getContext("2d")
} catch (error) {
  ctx = null
  console.log("canvas is not supported")
}

export const measureText = (
  text: string,
  fontSize: number,
  fontFamily = REGEX_FONT_FAMILY
): [number, number] => {
  let width = 0
  if (ctx) {
    ctx.font = `${fontSize}px ${fontFamily}`
    ;({ width } = ctx.measureText(text))
  } else {
    width = text.length * fontSize * 0.75
  }
  let fontHeight = 1.5 * fontSize
  return [width, fontHeight]
}

const measureQuantifier = (node: AST.Node): [number, number] => {
  if ((node.type === "group" || node.type === "character") && node.quantifier) {
    const { quantifier } = node
    const text = getQuantifierText(quantifier)
    const [textWidth] = measureText(text, GRAPH_QUANTIFIER_TEXT_FONTSIZE)
    const width =
      textWidth +
      GRAPH_ICON_SIZE +
      (quantifier.max === Infinity ? GRAPH_ICON_SIZE : 0)
    return [width, GRAPH_QUANTIFIER_MEASURE_HEIGHT]
  }
  return ZERO_SIZE
}

const measureTexts = (texts: string[]): [number, number][] => {
  return texts.map((text) => measureText(text, GRAPH_TEXT_FONT_SIZE))
}

const measureNodeText = (texts: string[] | string): [number, number] => {
  let width = 0
  let height = 0
  if (typeof texts === "string") {
    ;[width, height] = measureText(texts, GRAPH_TEXT_FONT_SIZE)
  } else {
    const sizes = measureTexts(texts)
    for (const size of sizes) {
      const [w, h] = size
      width = Math.max(width, w)
      height += h
    }
  }
  return [
    width + GRAPH_NODE_PADDING_HORIZONTAL * 2,
    height + GRAPH_NODE_PADDING_VERTICAL * 2,
  ]
}

const measureRanges = (ranges: AST.Range[]): [number, number] => {
  const singleRangeSet = new Set<string>()
  let width = 0
  let height = 0
  ranges.forEach((range) => {
    let text = ""
    let quotes = 0
    const { from, to } = range
    if (from.length === 1) {
      if (from === to) {
        singleRangeSet.add(from)
        return
      } else {
        text = `"${from}" - "${to}"`
        quotes += 2
      }
    } else {
      if (from === to) {
        const res = tryCharacterClassText(from)
        text = res[1] ? t(res[0]) : res[0]
        quotes += res[1] ? 0 : 1
      } else {
        const fromRes = tryCharacterClassText(from)
        const toRes = tryCharacterClassText(to)
        const fromText = fromRes[1] ? t(fromRes[0]) : fromRes[0]
        const toText = toRes[1] ? t(toRes[0]) : toRes[0]
        text = `${fromText} - ${toText}`
        quotes += (fromRes[1] ? 0 : 1) + (toRes[1] ? 0 : 1)
      }
    }
    let [w, h] = measureText(text, GRAPH_TEXT_FONT_SIZE)
    w += quotes * GRAPH_QUOTE_PADDING * 2
    width = Math.max(width, w)
    height += h
  })
  if (singleRangeSet.size > 0) {
    const text = '"' + Array.from(singleRangeSet).join("") + '"'
    let [w, h] = measureText(text, GRAPH_TEXT_FONT_SIZE)
    w += GRAPH_QUOTE_PADDING * 2
    width = Math.max(width, w)
    height += h
  }
  return [
    width + GRAPH_NODE_PADDING_HORIZONTAL * 2,
    height + GRAPH_NODE_PADDING_VERTICAL * 2,
  ]
}

const measureCharacter = (node: AST.CharacterNode): [number, number] => {
  let size: [number, number] = [0, 0]
  switch (node.kind) {
    case "string": {
      const { value } = node
      if (value === "") {
        size = measureNodeText(t("Empty"))
      } else {
        size = measureNodeText(`"${value}"`)
        size[0] += GRAPH_QUOTE_PADDING * 2
      }
      break
    }
    case "class": {
      const { value } = node
      if (value === "") {
        size = measureNodeText(t("Empty"))
      } else if (value in characterClassTextMap) {
        size = measureNodeText(
          t(characterClassTextMap[value as CharacterClassKey])
        )
      } else {
        size = measureNodeText(value)
        size[0] += GRAPH_QUOTE_PADDING * 2
      }
      break
    }
    case "ranges": {
      size = measureRanges(node.ranges)
      break
    }
    default:
      break
  }
  return size
}

export const getBoxSize = (
  node: AST.Node,
  contentSize: [number, number]
): [number, number] => {
  const nameSize = measureNodeName(node)
  const quantifierSize = measureQuantifier(node)
  const width = Math.max(contentSize[0], nameSize[0], quantifierSize[0])
  const height = contentSize[1] + 2 * Math.max(nameSize[1], quantifierSize[1])
  return [width, height]
}

export const largerWithMinSize = (size: [number, number]): [number, number] => [
  Math.max(size[0], GRAPH_NODE_MIN_WIDTH),
  Math.max(size[1], GRAPH_NODE_MIN_HEIGHT),
]

export const measureSimpleNode = (
  node:
    | AST.CharacterNode
    | AST.BackReferenceNode
    | AST.BeginningBoundaryAssertionNode
    | AST.EndBoundaryAssertionNode
    | AST.WordBoundaryAssertionNode
    | AST.RootNode
): NodeSize => {
  let contentSize: [number, number] = EMPTY_SIZE
  switch (node.type) {
    case "root": {
      return { box: ROOT_SIZE, content: ROOT_SIZE }
    }
    case "character": {
      contentSize = measureCharacter(node)
      break
    }
    case "backReference": {
      contentSize = measureNodeText(getBackReferenceText(node, t))
      break
    }
    case "boundaryAssertion": {
      contentSize = measureNodeText(getBoundaryAssertionText(node, t))
      break
    }
    default:
      break
  }
  contentSize = largerWithMinSize(contentSize)
  const boxSize = getBoxSize(node, contentSize)
  return {
    box: boxSize,
    content: contentSize,
  }
}

export const measureNodeName = (
  node: AST.Node | AST.Regex
): [number, number] => {
  if (node.type !== "regex") {
    const name = getNameText(node, t)
    if (name) {
      return [measureNodeText(name)[0], GRAPH_NAME_MEASURE_HEIGHT]
    }
  }
  return ZERO_SIZE
}
