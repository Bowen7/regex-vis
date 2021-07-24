import produce from "immer"
import * as AST from "../ast"
import { getNodeById } from "../visit"
const contentIt = (ast: AST.Regex, id: string, content: AST.Content) =>
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
      case "backReference": {
        const { ref } = content
        nodeList[index] = { id, type: "backReference", ref }
        break
      }
      case "beginningAssertion": {
        nodeList[index] = { id, type: "boundaryAssertion", kind: "beginning" }
        break
      }
      case "endAssertion": {
        nodeList[index] = { id, type: "boundaryAssertion", kind: "end" }
        break
      }
      case "wordBoundaryAssertion": {
        nodeList[index] = {
          id,
          type: "boundaryAssertion",
          kind: "word",
          negate: content.negate,
        }
      }
    }
  })

export default contentIt
