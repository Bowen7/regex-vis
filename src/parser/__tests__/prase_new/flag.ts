import * as AST from "../../ast"
type Tests = {
  [key: string]: AST.Regex | AST.RegexError
}
const tests: Tests = {
  "/(?:)/g": {
    type: "regex",
    body: [
      {
        id: "",
        type: "group",
        kind: "nonCapturing",
        children: [],
        quantifier: null,
      },
    ],
    flags: [{ kind: "g" }],
  },
  "/(?:)/z": {
    type: "error",
    message: `Invalid regular expression flags 'z'`,
  },
}
export default tests
