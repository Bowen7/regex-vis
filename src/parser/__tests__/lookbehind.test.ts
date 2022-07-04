import parse from "../parse"

test("parse should return correct ast when receiving lookbehind assertion", () => {
  const expected = {
    id: "",
    type: "regex",
    body: [
      {
        id: "",
        type: "lookAroundAssertion",
        kind: "lookbehind",
        children: [
          {
            id: "",
            type: "character",
            kind: "string",
            value: "a",
            quantifier: null,
          },
        ],
        negate: false,
      },
    ],
    flags: [],
    literal: true,
  }
  const result = parse("/(?<=a)/", { idGenerator: () => "" })
  expect(result).toEqual(expected)
})

test("parse should return correct ast when receiving negate lookbehind assertion", () => {
  const expected = {
    id: "",
    type: "regex",
    body: [
      {
        id: "",
        type: "lookAroundAssertion",
        kind: "lookbehind",
        children: [
          {
            id: "",
            type: "character",
            kind: "string",
            value: "a",
            quantifier: null,
          },
        ],
        negate: true,
      },
    ],
    flags: [],
    literal: true,
  }
  const result = parse("/(?<!a)/", { idGenerator: () => "" })
  expect(result).toEqual(expected)
})

test("parse should return correct ast when receiving complex lookbehind assertion", () => {
  const cases = {
    "/((?<=\\w{3}))f/": {
      id: "",
      type: "regex",
      body: [
        {
          id: "",
          type: "group",
          kind: "capturing",
          name: "1",
          index: 1,
          children: [
            {
              id: "",
              type: "lookAroundAssertion",
              kind: "lookbehind",
              children: [
                {
                  id: "",
                  type: "character",
                  kind: "class",
                  value: "\\w",
                  quantifier: { kind: "custom", min: 3, max: 3, greedy: true },
                },
              ],
              negate: false,
            },
          ],
          quantifier: null,
        },
        {
          id: "",
          type: "character",
          kind: "string",
          value: "f",
          quantifier: null,
        },
      ],
      flags: [],
      literal: true,
    },
    "/(?<a>(?<=\\w{3}))f/": {
      id: "",
      type: "regex",
      body: [
        {
          id: "",
          type: "group",
          kind: "namedCapturing",
          name: "a",
          index: 1,
          children: [
            {
              id: "",
              type: "lookAroundAssertion",
              kind: "lookbehind",
              negate: false,
              children: [
                {
                  id: "",
                  type: "character",
                  kind: "class",
                  value: "\\w",
                  quantifier: { kind: "custom", min: 3, max: 3, greedy: true },
                },
              ],
            },
          ],
          quantifier: null,
        },
        {
          id: "",
          type: "character",
          kind: "string",
          value: "f",
          quantifier: null,
        },
      ],
      flags: [],
      literal: true,
    },
    "/(?<!(?<a>\\d){3})f/": {
      id: "",
      type: "regex",
      body: [
        {
          id: "",
          type: "lookAroundAssertion",
          kind: "lookbehind",
          negate: true,
          children: [
            {
              id: "",
              type: "group",
              kind: "namedCapturing",
              name: "a",
              index: 1,
              children: [
                {
                  id: "",
                  type: "character",
                  kind: "class",
                  value: "\\d",
                  quantifier: null,
                },
              ],
              quantifier: { kind: "custom", min: 3, max: 3, greedy: true },
            },
          ],
        },
        {
          id: "",
          type: "character",
          kind: "string",
          value: "f",
          quantifier: null,
        },
      ],
      flags: [],
      literal: true,
    },
    "/(?<a>(?<!\\D{3}))f|f/": {
      id: "",
      type: "regex",
      body: [
        {
          id: "",
          type: "choice",
          branches: [
            [
              {
                id: "",
                type: "group",
                kind: "namedCapturing",
                name: "a",
                index: 1,
                children: [
                  {
                    id: "",
                    type: "lookAroundAssertion",
                    kind: "lookbehind",
                    negate: true,
                    children: [
                      {
                        id: "",
                        type: "character",
                        kind: "class",
                        value: "\\D",
                        quantifier: {
                          kind: "custom",
                          min: 3,
                          max: 3,
                          greedy: true,
                        },
                      },
                    ],
                  },
                ],
                quantifier: null,
              },
              {
                id: "",
                type: "character",
                kind: "string",
                value: "f",
                quantifier: null,
              },
            ],
            [
              {
                id: "",
                type: "character",
                kind: "string",
                value: "f",
                quantifier: null,
              },
            ],
          ],
        },
      ],
      flags: [],
      literal: true,
    },
  }
  for (const [pattern, expected] of Object.entries(cases)) {
    const result = parse(pattern, { idGenerator: () => "" })
    expect(result).toEqual(expected)
  }
})
