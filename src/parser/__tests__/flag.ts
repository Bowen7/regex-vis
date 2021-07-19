import * as AST from "../ast"
type Tests = {
  [key: string]: AST.Regex | AST.RegexError
}
export const invalidTests: Tests = {
  "/(?:)/z": {
    type: "error",
    message: `Invalid regular expression flags 'z'`,
  },
}
export const validTests: Tests = {
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
}

const tests = { ...invalidTests, ...validTests }

export default tests
