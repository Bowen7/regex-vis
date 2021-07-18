import * as AST from "../../ast"
type Tests = {
  [key: string]: AST.Regex
}
const tests: Tests = {
  "/(?<=a)/": {
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
  },
  "/(?<!a)/": {
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
  },
  "/((?<=\\w{3}))f/": {
    type: "regex",
    body: [
      {
        id: "",
        type: "group",
        kind: "capturing",
        name: "1",
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
  },
  "/(?<a>(?<=\\w{3}))f/": {
    type: "regex",
    body: [
      {
        id: "",
        type: "group",
        kind: "namedCapturing",
        name: "a",
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
  },
  "/(?<!(?<a>\\d){3})f/": {
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
  },
  "/(?<a>(?<!\\D{3}))f|f/": {
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
  },
}
export default tests
