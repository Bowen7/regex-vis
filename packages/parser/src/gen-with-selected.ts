import { CodeGen } from "./gen"
import * as AST from "./ast"

class CodeGenWithSelected extends CodeGen {
  private headId = ""
  private tailId = ""
  public startIndex = 0
  public endIndex = 0
  constructor(ast: AST.Regex, selectedIds: string[]) {
    super(ast)
    if (selectedIds.length > 0) {
      this.headId = selectedIds[0]
      this.tailId = selectedIds[selectedIds.length - 1]
    }
  }

  genNode(node: AST.Node) {
    if (node.id === this.headId) {
      this.startIndex = this.regex.length
    }
    super.genNode(node)
    if (node.id === this.tailId) {
      this.endIndex = this.regex.length
    }
  }
}

export const genWithSelected = (ast: AST.Regex, selectedIds: string[]) => {
  const codeGen = new CodeGenWithSelected(ast, selectedIds)
  const regex = codeGen.gen()
  return { regex, startIndex: codeGen.startIndex, endIndex: codeGen.endIndex }
}
