import { AST } from "@/parser"

export const getQuantifier = (node: AST.Node) =>
  node.type === "character" || node.type === "group" ? node.quantifier : null

const assertionNameMap = {
  beginning: "Begin with",
  end: "End with",
  lookahead: ["Followed by:", "Not followed by"],
  lookbehind: ["Preceded by", "Not Preceded by"],
  word: ["WordBoundary", "NonWordBoundary"],
}

export const getName = (node: AST.Node): string | null => {
  switch (node.type) {
    case "character":
      if (node.kind === "ranges") {
        return node.negate ? "None of" : "One of"
      }
      return null
    case "group":
      if (node.kind === "capturing" || node.kind === "namedCapturing") {
        return "Group #" + node.name
      }
      return null
    case "lookAroundAssertion": {
      const { kind, negate } = node
      return assertionNameMap[kind][negate ? 1 : 0]
    }

    default:
      return null
  }
}
