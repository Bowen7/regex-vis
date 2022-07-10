import parse from "../parse"
import * as AST from "../ast"

test("parse should return error when receiving invalid flags", () => {
  const expected = {
    type: "error",
    message: `Invalid flags supplied to RegExp constructor 'z'`,
  }
  const result = parse("/(?:)/z", { idGenerator: () => "" })
  expect(result).toEqual(expected)
})

test("parse should return correct ast when receiving flags", () => {
  const expected: AST.Regex = {
    id: "",
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
    flags: ["g"],
    literal: true,
    escapeBackslash: false,
  }
  const result = parse("/(?:)/g", { idGenerator: () => "" })
  expect(result).toEqual(expected)
})
