import parse from "../parse"
import * as AST from "../ast"
test("parse should return correct ast when receiving a empty string", () => {
  const expected = {
    id: "",
    type: "regex",
    body: [],
    flags: [],
    literal: false,
  }
  const result = parse("", { idGenerator: () => "" })
  expect(result).toEqual(expected)
})

test("parse should return correct ast when receiving '\\\\n'", () => {
  const expected: AST.Regex = {
    id: "",
    type: "regex",
    body: [
      {
        id: "",
        type: "character",
        kind: "class",
        value: "\\\\n",
        quantifier: null,
      },
    ],
    flags: [],
    literal: false,
  }
  const result = parse("\\\\n", { idGenerator: () => "" })
  expect(result).toEqual(expected)
})

test("parse should return correct ast when receiving '\\n'", () => {
  const expected: AST.Regex = {
    id: "",
    type: "regex",
    body: [
      {
        id: "",
        type: "character",
        kind: "class",
        value: "\\n",
        quantifier: null,
      },
    ],
    flags: [],
    literal: false,
  }
  const result = parse("\\n", { idGenerator: () => "" })
  expect(result).toEqual(expected)
})

test("parse should return correct ast when receiving unnecessary escape character with a backslash", () => {
  const expected: AST.Regex = {
    id: "",
    type: "regex",
    body: [
      {
        id: "",
        type: "character",
        kind: "class",
        value: "a",
        quantifier: null,
      },
    ],
    flags: [],
    literal: false,
  }
  const result = parse("\\a", { idGenerator: () => "" })
  expect(result).toEqual(expected)
})

test("parse should return correct ast when receiving unnecessary escape character with double backslash", () => {
  const expected: AST.Regex = {
    id: "",
    type: "regex",
    body: [
      {
        id: "",
        type: "character",
        kind: "class",
        value: "\\a",
        quantifier: null,
      },
    ],
    flags: [],
    literal: false,
  }
  const result = parse("\\\\a", { idGenerator: () => "" })
  expect(result).toEqual(expected)
})
