import produce from "immer"
import * as AST from "../ast"
import { visitTree } from "../visit"
const makeChoiceValid = (ast: AST.Regex) => {
  return produce(ast, (draft) => {
    visitTree(
      draft,
      (node: AST.Node, nodeList: AST.Node[], parent: AST.ParentNode) => {
        if (node.type === "choice") {
          switch (parent.type) {
            case "regex": {
              if (nodeList.length > 3) {
              }
              break
            }
            case "choice": {
              if (nodeList.length === 1) {
              } else {
              }
              break
            }
            case "group":
            case "lookAroundAssertion": {
              if (nodeList.length === 1) {
              } else {
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
