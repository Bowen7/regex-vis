import * as AST from "../ast"

export const updateFlags = (ast: AST.Regex, flags: string[]) => {
  ast.flags = flags as AST.Flag[]
}
