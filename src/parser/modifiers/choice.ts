import produce from "immer"
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
const makeChoiceValid = (ast: AST.Regex) => {
  return produce(ast, (draft) => {
    visit(
      draft,
      (
        node: AST.Node,
        nodeList: AST.Node[],
        index: number,
        parent: AST.ParentNode
      ) => {
        if (node.type === "choice") {
          switch (parent.type) {
            case "regex": {
              if (nodeList.length > 3) {
                nonCapturingGroupIt(nodeList, node)
              }
              break
            }
            case "choice": {
              if (nodeList.length > 1) {
                nonCapturingGroupIt(nodeList, node)
              }
              break
            }
            case "group":
            case "lookAroundAssertion": {
              if (nodeList.length > 1) {
                nonCapturingGroupIt(nodeList, node)
              }
              break
            }
          }
        }
      }
    )
  })
}
export default makeChoiceValid
