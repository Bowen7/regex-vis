import { nanoid } from "nanoid"
import * as AST from "../ast"
import { visit } from "../visit"
import { replaceFromLists } from "./replace"
const nonCapturingGroupIt = (nodeList: AST.Node[], node: AST.ChoiceNode) => {
  const groupNode: AST.GroupNode = {
    id: nanoid(),
    type: "group",
    kind: "nonCapturing",
    children: [node],
    quantifier: null,
  }
  replaceFromLists(nodeList, [node], [groupNode])
}

export const makeChoiceValid = (ast: AST.Regex) => {
  let valid = true
  visit(
    ast,
    (
      node: AST.Node,
      nodeList: AST.Node[],
      _index: number,
      parent: AST.ParentNode
    ) => {
      if (node.type === "choice") {
        switch (parent.type) {
          case "regex":
          case "choice":
          case "group":
          case "lookAroundAssertion": {
            if (nodeList.length > 1) {
              nonCapturingGroupIt(nodeList, node)
              valid = false
            }
            break
          }
        }
      }
    }
  )
  return valid
}
