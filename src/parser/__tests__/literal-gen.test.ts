import gen from "../gen"

test("gen with literal = true", () => {
  expect(
    gen({
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
      flags: ["g"],
      literal: true,
      escapeBackslash: false,
    })
  ).toBe("/a/g")

  expect(
    gen(
      {
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
        flags: ["g"],
        literal: false,
        escapeBackslash: false,
      },
      { literal: true }
    )
  ).toBe("/a/g")

  expect(
    gen({
      id: "",
      type: "regex",
      body: [
        {
          id: "",
          type: "character",
          kind: "string",
          value: "/",
          quantifier: null,
        },
      ],
      flags: [],
      literal: true,
      escapeBackslash: false,
    })
  ).toBe("/\\//")
})

test("gen with literal = false", () => {
  expect(
    gen({
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
      flags: ["g"],
      literal: false,
      escapeBackslash: false,
    })
  ).toBe("a")

  expect(
    gen({
      id: "",
      type: "regex",
      body: [
        {
          id: "",
          type: "character",
          kind: "string",
          value: "/",
          quantifier: null,
        },
      ],
      flags: [],
      literal: false,
      escapeBackslash: false,
    })
  ).toBe("/")
})

test("gen with escapeBackslash = false", () => {
  expect(
    gen({
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
    })
  ).toBe("\\d")

  expect(
    gen({
      id: "",
      type: "regex",
      body: [
        {
          id: "",
          type: "backReference",
          ref: "123",
        },
      ],
      flags: [],
      literal: false,
      escapeBackslash: false,
    })
  ).toBe("\\123")

  expect(
    gen({
      id: "",
      type: "regex",
      body: [
        {
          id: "",
          type: "backReference",
          ref: "name",
        },
      ],
      flags: [],
      literal: false,
      escapeBackslash: false,
    })
  ).toBe("\\k<name>")
})

test("gen with escapeBackslash = true", () => {
  expect(
    gen({
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
      escapeBackslash: true,
    })
  ).toBe("\\\\d")

  expect(
    gen({
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
    })
  ).toBe(".")

  expect(
    gen({
      id: "",
      type: "regex",
      body: [
        {
          id: "",
          type: "backReference",
          ref: "123",
        },
      ],
      flags: [],
      literal: false,
      escapeBackslash: true,
    })
  ).toBe("\\\\123")

  expect(
    gen({
      id: "",
      type: "regex",
      body: [
        {
          id: "",
          type: "backReference",
          ref: "name",
        },
      ],
      flags: [],
      literal: false,
      escapeBackslash: true,
    })
  ).toBe("\\\\k<name>")
})
