import * as AST from "../ast"
type Tests = {
  [key: string]: AST.Regex
}
const tests: Tests = {
  "": {
    id: "",
    type: "regex",
    body: [],
    flags: [],
    withSlash: false,
  },
}
export default tests
