import { Node } from "@/types"
import {
  characterClassTextMap,
  CharacterClassKey,
} from "@/parser/utils/character-class"

const AssertionNameMap = {
  start: "Start of line",
  end: "End of line",
  lookahead: ["Followed by:", "Not followed by"],
  lookbehind: ["Preceded by", "Not Preceded by"],
  word: "",
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
      return AssertionNameMap[kind][negate ? 1 : 0]
    }
    case "boundaryAssertion": {
      const { kind } = node.value
      return kind === "start" ? "Start of line" : "End of line"
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
      return node.value.negate ? ["NonWordBoundary"] : ["WordBoundary"]
    default:
      return null
  }
}
