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
  const result = parse("", { idGenerator: () => "", escapeBackslash: true })
  expect(result).toEqual(expected)
})

test("parse should return correct ast when receiving '\\\\n'", () => {
  const expected1: AST.Regex = {
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
    escapeBackslash: true,
  }
  expect(
    parse("\\\\n", {
      idGenerator: () => "",
      escapeBackslash: true,
    })
  ).toEqual(expected1)

  const expected2: AST.Regex = {
    id: "",
    type: "regex",
    body: [
      {
        id: "",
        type: "character",
        kind: "string",
        value: "\\n",
        quantifier: null,
      },
    ],
    flags: [],
    literal: false,
    escapeBackslash: true,
  }
  expect(
    parse("\\\\n", {
      idGenerator: () => "",
    })
  ).toEqual(expected2)
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
    escapeBackslash: true,
  }
  expect(
    parse("\\n", { idGenerator: () => "", escapeBackslash: true })
  ).toEqual(expected)
  expect(parse("\\n", { idGenerator: () => "" })).toEqual({
    ...expected,
    escapeBackslash: false,
  })
})

test("parse should return correct ast when receiving '\\d'", () => {
  const expected1: AST.Regex = {
    id: "",
    type: "regex",
    body: [
      {
        id: "",
        type: "character",
        kind: "string",
        value: "d",
        quantifier: null,
      },
    ],
    flags: [],
    literal: false,
    escapeBackslash: true,
  }
  const expected2: AST.Regex = {
    id: "",
    type: "regex",
    body: [
      {
        id: "",
        type: "character",
        kind: "class",
        value: "\\d",
        quantifier: null,
      },
    ],
    flags: [],
    literal: false,
    escapeBackslash: false,
  }
  expect(
    parse("\\d", { idGenerator: () => "", escapeBackslash: true })
  ).toEqual(expected1)
  expect(parse("\\d", { idGenerator: () => "" })).toEqual(expected2)
})

test("parse should return correct ast when receiving '\\\\d'", () => {
  const expected1: AST.Regex = {
    id: "",
    type: "regex",
    body: [
      {
        id: "",
        type: "character",
        kind: "class",
        value: "\\\\d",
        quantifier: null,
      },
    ],
    flags: [],
    literal: false,
    escapeBackslash: true,
  }
  const expected2: AST.Regex = {
    id: "",
    type: "regex",
    body: [
      {
        id: "",
        type: "character",
        kind: "string",
        value: "\\d",
        quantifier: null,
      },
    ],
    flags: [],
    literal: false,
    escapeBackslash: false,
  }
  expect(
    parse("\\\\d", {
      idGenerator: () => "",
      escapeBackslash: true,
    })
  ).toEqual(expected1)
  expect(
    parse("\\\\d", {
      idGenerator: () => "",
    })
  ).toEqual(expected2)
})

test("parse should return correct ast when receiving '\\\\a'", () => {
  const expected1: AST.Regex = {
    id: "",
    type: "regex",
    body: [
      {
        id: "",
        type: "character",
        kind: "string",
        value: "a",
        quantifier: null,
      },
    ],
    flags: [],
    literal: false,
    escapeBackslash: true,
  }
  const expected2: AST.Regex = {
    id: "",
    type: "regex",
    body: [
      {
        id: "",
        type: "character",
        kind: "string",
        value: "\\a",
        quantifier: null,
      },
    ],
    flags: [],
    literal: false,
    escapeBackslash: false,
  }
  expect(
    parse("\\\\a", {
      idGenerator: () => "",
      escapeBackslash: true,
    })
  ).toEqual(expected1)
  expect(
    parse("\\\\a", {
      idGenerator: () => "",
    })
  ).toEqual(expected2)
})

test("parse should return correct ast when receiving '\\.'", () => {
  const expected1: AST.Regex = {
    id: "",
    type: "regex",
    body: [
      {
        id: "",
        type: "character",
        kind: "class",
        value: ".",
        quantifier: null,
      },
    ],
    flags: [],
    literal: false,
    escapeBackslash: true,
  }
  const expected2: AST.Regex = {
    id: "",
    type: "regex",
    body: [
      {
        id: "",
        type: "character",
        kind: "string",
        value: ".",
        quantifier: null,
      },
    ],
    flags: [],
    literal: false,
    escapeBackslash: false,
  }
  expect(
    parse("\\a", {
      idGenerator: () => "",
      escapeBackslash: true,
    })
  ).toEqual(expected1)
  expect(
    parse("\\a", {
      idGenerator: () => "",
    })
  ).toEqual(expected2)
})

test("parse should return correct ast when receiving '\\1'", () => {
  const expected1: AST.Regex = {
    id: "",
    type: "regex",
    body: [
      {
        id: "",
        type: "character",
        kind: "string",
        value: "1",
        quantifier: null,
      },
    ],
    flags: [],
    literal: false,
    escapeBackslash: true,
  }
  const expected2: AST.Regex = {
    id: "",
    type: "regex",
    body: [
      {
        id: "",
        type: "backReference",
        ref: "1",
      },
    ],
    flags: [],
    literal: false,
    escapeBackslash: false,
  }
  expect(
    parse("\\1", {
      idGenerator: () => "",
      escapeBackslash: true,
    })
  ).toEqual(expected1)
  expect(
    parse("\\1", {
      idGenerator: () => "",
    })
  ).toEqual(expected2)
})

test("parse should return correct ast when receiving '\\\\1'", () => {
  const expected1: AST.Regex = {
    id: "",
    type: "regex",
    body: [
      {
        id: "",
        type: "backReference",
        ref: "1",
      },
    ],
    flags: [],
    literal: false,
    escapeBackslash: true,
  }
  const expected2: AST.Regex = {
    id: "",
    type: "regex",
    body: [
      {
        id: "",
        type: "character",
        kind: "string",
        value: "\\1",
        quantifier: null,
      },
    ],
    flags: [],
    literal: false,
    escapeBackslash: false,
  }
  expect(
    parse("\\\\1", {
      idGenerator: () => "",
      escapeBackslash: true,
    })
  ).toEqual(expected1)
  expect(
    parse("\\\\1", {
      idGenerator: () => "",
    })
  ).toEqual(expected2)
})
