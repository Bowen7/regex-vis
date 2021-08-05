import { AST } from "@/parser"
import { characterClassTextMap, CharacterClassKey } from "@/parser"

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

export const getTextsWithBacktick = (
  node: AST.Node
): null | string | string[] => {
  switch (node.type) {
    case "character":
      if (node.kind === "ranges") {
        let singleRangeSet = new Set<string>()
        const texts: string[] = []
        node.ranges.forEach(({ from, to }) => {
          if (from === to) {
            if (from.length === 1) {
              singleRangeSet.add(from)
            } else {
              texts.push(from)
            }
          } else {
            const text = `\`${from}\` - \`${to}\``
            texts.push(text)
          }
        })
        if (singleRangeSet.size > 0) {
          const text = Array.from(singleRangeSet).join("")
          texts.unshift(`\`${text}\``)
        }
        return texts
      } else if (node.kind === "class") {
        return (
          characterClassTextMap[node.value as CharacterClassKey] || node.value
        )
      }
      return `\`${node.value}\``
    case "boundaryAssertion":
      if (node.kind === "word") {
        const negate = node.negate
        return assertionNameMap.word[negate ? 1 : 0]
      } else {
        const kind = node.kind
        return assertionNameMap[kind]
      }
    case "backReference":
      return `BackReference #${node.ref}`
    default:
      return null
  }
}

export const getTexts = (
  node: AST.Node
):
  | ({ type: "backtick" | "hyphen" } | { type: "text"; text: string })[][]
  | null => {
  switch (node.type) {
    case "character":
      if (node.kind === "ranges") {
        let singleRangeSet = new Set<string>()
        const texts: (
          | { type: "backtick" | "hyphen" }
          | { type: "text"; text: string }
        )[][] = []
        node.ranges.forEach(({ from, to }) => {
          if (from === to) {
            if (from.length === 1) {
              singleRangeSet.add(from)
            } else {
              texts.push([
                { type: "backtick" },
                { type: "text", text: from },
                { type: "backtick" },
              ])
            }
          } else {
            texts.push([
              { type: "backtick" },
              { type: "text", text: from },
              { type: "backtick" },
              { type: "hyphen" },
              { type: "backtick" },
              { type: "text", text: to },
              { type: "backtick" },
            ])
          }
        })
        if (singleRangeSet.size > 0) {
          const text = Array.from(singleRangeSet).join("")
          texts.unshift([
            { type: "backtick" },
            { type: "text", text },
            { type: "backtick" },
          ])
        }
        return texts
      } else if (node.kind === "class") {
        return [
          [
            {
              type: "text",
              text:
                characterClassTextMap[node.value as CharacterClassKey] ||
                node.value,
            },
          ],
        ]
      }
      return [
        [
          { type: "backtick" },
          { type: "text", text: node.value },
          { type: "backtick" },
        ],
      ]
    case "boundaryAssertion":
      if (node.kind === "word") {
        const negate = node.negate
        return [[{ type: "text", text: assertionNameMap.word[negate ? 1 : 0] }]]
      } else {
        const kind = node.kind
        return [[{ type: "text", text: assertionNameMap[kind] }]]
      }
    case "backReference":
      return [[{ type: "text", text: `BackReference #${node.ref}` }]]
    default:
      return null
  }
}
