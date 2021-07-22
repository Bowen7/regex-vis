import produce from "immer"
import * as AST from "../ast"
import { getNodeById } from "../visit"
const contentIt = (
  ast: AST.Regex,
  id: string,
  content:
    | { kind: "string" | "class"; value: string }
    | { kind: "ranges"; ranges: AST.Range[]; negate: boolean }
    | { kind: "backReference"; ref: string }
) =>
  produce(ast, (draft) => {
    const { node, nodeList, index } = getNodeById(draft, id)

    const quantifier = node.type === "character" ? node.quantifier : null

    switch (content.kind) {
      case "ranges":
        {
          const { kind, negate, ranges } = content
          nodeList[index] = {
            id,
            type: "character",
            kind,
            negate,
            ranges,
            quantifier,
          }
        }
        break
      case "string":
      case "class": {
        const { kind, value } = content
        nodeList[index] = { id, type: "character", kind, value, quantifier }
        break
      }
      case "backReference":
        {
          const { ref } = content
          nodeList[index] = { id, type: "backReference", ref }
        }
        break
    }
  })

export default contentIt
