import { Node } from "@/types"
import {
  characterClassTextMap,
  CharacterClassKey,
} from "@/parser/utils/character-class"

const assertionNameMap = {
  start: "Start of line",
  end: "End of line",
  lookahead: ["Followed by:", "Not followed by"],
  lookbehind: ["Preceded by", "Not Preceded by"],
  word: ["WordBoundary", "NonWordBoundary"],
}

export const getName = (node: Node): string | null => {
  switch (node.type) {
    case "character":
      if (node.value.kind === "ranges") {
        return node.value.negate ? "None of" : "One of"
      }
      return null
    case "group":
      if (
        node.value.kind === "capturing" ||
        node.value.kind === "namedCapturing"
      ) {
        return "Group #" + node.value.name
      }
      return null
    case "lookaroundAssertion": {
      const { kind, negate } = node.value
      return assertionNameMap[kind][negate ? 1 : 0]
    }

    default:
      return null
  }
}

export const getTexts = (node: Node) => {
  switch (node.type) {
    case "character":
      if (node.value.kind === "ranges") {
        return node.value.value.map(({ from, to }) =>
          from === to ? from : `${from} - ${to}`
        )
      } else if (node.value.kind === "class") {
        return [characterClassTextMap[node.value.value as CharacterClassKey]]
      }
      return [node.value.value]
    case "boundaryAssertion":
      if (node.value.kind === "word") {
        const negate = node.value.negate
        return [assertionNameMap.word[negate ? 1 : 0]]
      } else {
        const kind = node.value.kind
        return [assertionNameMap[kind]]
      }
    default:
      return null
  }
}
