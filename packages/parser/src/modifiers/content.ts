import { nanoid } from "nanoid"
import * as AST from "../ast"
import { getNodeById } from "../visit"
const updateContent = (ast: AST.Regex, id: string, content: AST.Content) => {
  let nextSelectedId = id
  const { node, nodeList, index } = getNodeById(ast, id)

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
    case "string": {
      const { kind, value } = content
      if (
        node.type === "character" &&
        node.kind === "string" &&
        value.length > 1 &&
        quantifier
      ) {
        const id = nanoid()
        nodeList[index] = {
          id,
          type: "group",
          kind: "nonCapturing",
          children: [{ ...node, value, quantifier: null }],
          quantifier,
        }
        nextSelectedId = id
      } else {
        nodeList[index] = { id, type: "character", kind, value, quantifier }
      }
      break
    }
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
      break
    }
  }
  return nextSelectedId
}

export default updateContent
