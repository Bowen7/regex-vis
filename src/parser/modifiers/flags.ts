import produce from "immer"
import * as AST from "../ast"

const updateFlags = (ast: AST.Regex, flags: string[]) =>
  produce(ast, (draft) => {
    draft.flags = flags as AST.Flag[]
    if (flags.length > 0) {
      draft.withSlash = true
    }
  })

export default updateFlags
