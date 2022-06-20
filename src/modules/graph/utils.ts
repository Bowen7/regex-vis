import { TFunction } from "react-i18next"
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

export const getName = (
  node: AST.Node,
  t: TFunction
): [string | null, boolean] => {
  switch (node.type) {
    case "character":
      if (node.kind === "ranges") {
        return t(node.negate ? "None of" : "One of")
      }
      return [null, false]
    case "group":
      if (node.kind === "capturing" || node.kind === "namedCapturing") {
        return [t("Group") + " #" + node.name, true]
      }
      return [null, false]
    case "lookAroundAssertion": {
      const { kind, negate } = node
      return [t(assertionNameMap[kind][negate ? 1 : 0]), false]
    }

    default:
      return [null, false]
  }
}
