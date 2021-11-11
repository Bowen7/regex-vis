import * as AST from "../ast"
type Tests = {
  [key: string]: AST.Regex
}
const tests: Tests = {
  "/foo/": {
    type: "regex",
    body: [
      {
        id: "",
        type: "character",
        kind: "string",
        value: "foo",
        quantifier: null,
      },
    ],
    flags: [],
    withSlash: true,
  },
  "/foo|bar/": {
    type: "regex",
    body: [
      {
        id: "",
        type: "choice",
        branches: [
          [
            {
              id: "",
              type: "character",
              kind: "string",
              value: "foo",
              quantifier: null,
            },
          ],
          [
            {
              id: "",
              type: "character",
              kind: "string",
              value: "bar",
              quantifier: null,
            },
          ],
        ],
      },
    ],
    flags: [],
    withSlash: true,
  },
  "/||||/": {
    type: "regex",
    body: [{ id: "", type: "choice", branches: [[], [], [], [], []] }],
    flags: [],
    withSlash: true,
  },
  "/^|$|\\b|\\B/": {
    type: "regex",
    body: [
      {
        id: "",
        type: "choice",
        branches: [
          [{ id: "", type: "boundaryAssertion", kind: "beginning" }],
          [{ id: "", type: "boundaryAssertion", kind: "end" }],
          [{ id: "", type: "boundaryAssertion", kind: "word", negate: false }],
          [{ id: "", type: "boundaryAssertion", kind: "word", negate: true }],
        ],
      },
    ],
    flags: [],
    withSlash: true,
  },
  "/(?=)/": {
    type: "regex",
    body: [
      {
        id: "",
        type: "lookAroundAssertion",
        kind: "lookahead",
        negate: false,
        children: [],
      },
    ],
    flags: [],
    withSlash: true,
  },
  "/(?=foo)/": {
    type: "regex",
    body: [
      {
        id: "",
        type: "lookAroundAssertion",
        kind: "lookahead",
        negate: false,
        children: [
          {
            id: "",
            type: "character",
            kind: "string",
            value: "foo",
            quantifier: null,
          },
        ],
      },
    ],
    flags: [],
    withSlash: true,
  },
  "/(?!)/": {
    type: "regex",
    body: [
      {
        id: "",
        type: "lookAroundAssertion",
        kind: "lookahead",
        negate: true,
        children: [],
      },
    ],
    flags: [],
    withSlash: true,
  },
  "/(?!foo)/": {
    type: "regex",
    body: [
      {
        id: "",
        type: "lookAroundAssertion",
        kind: "lookahead",
        negate: true,
        children: [
          {
            id: "",
            type: "character",
            kind: "string",
            value: "foo",
            quantifier: null,
          },
        ],
      },
    ],
    flags: [],
    withSlash: true,
  },
  "/a*/": {
    type: "regex",
    body: [
      {
        id: "",
        type: "character",
        kind: "string",
        value: "a",
        quantifier: { kind: "*", min: 0, max: Infinity, greedy: true },
      },
    ],
    flags: [],
    withSlash: true,
  },
  "/a+/": {
    type: "regex",
    body: [
      {
        id: "",
        type: "character",
        kind: "string",
        value: "a",
        quantifier: { kind: "+", min: 1, max: Infinity, greedy: true },
      },
    ],
    flags: [],
    withSlash: true,
  },
  "/a?/": {
    type: "regex",
    body: [
      {
        id: "",
        type: "character",
        kind: "string",
        value: "a",
        quantifier: { kind: "?", min: 0, max: 1, greedy: true },
      },
    ],
    flags: [],
    withSlash: true,
  },
  "/a{/": {
    type: "regex",
    body: [
      {
        id: "",
        type: "character",
        kind: "string",
        value: "a{",
        quantifier: null,
      },
    ],
    flags: [],
    withSlash: true,
  },
  "/a{}/": {
    type: "regex",
    body: [
      {
        id: "",
        type: "character",
        kind: "string",
        value: "a{}",
        quantifier: null,
      },
    ],
    flags: [],
    withSlash: true,
  },
  "/a{a}/": {
    type: "regex",
    body: [
      {
        id: "",
        type: "character",
        kind: "string",
        value: "a{a}",
        quantifier: null,
      },
    ],
    flags: [],
    withSlash: true,
  },
  "/a{1}/": {
    type: "regex",
    body: [
      {
        id: "",
        type: "character",
        kind: "string",
        value: "a",
        quantifier: { kind: "custom", min: 1, max: 1, greedy: true },
      },
    ],
    flags: [],
    withSlash: true,
  },
  "/a{1/": {
    type: "regex",
    body: [
      {
        id: "",
        type: "character",
        kind: "string",
        value: "a{1",
        quantifier: null,
      },
    ],
    flags: [],
    withSlash: true,
  },
  "/a{1,}/": {
    type: "regex",
    body: [
      {
        id: "",
        type: "character",
        kind: "string",
        value: "a",
        quantifier: { kind: "custom", min: 1, max: Infinity, greedy: true },
      },
    ],
    flags: [],
    withSlash: true,
  },
  "/a{1,/": {
    type: "regex",
    body: [
      {
        id: "",
        type: "character",
        kind: "string",
        value: "a{1,",
        quantifier: null,
      },
    ],
    flags: [],
    withSlash: true,
  },
  "/a{1,2}/": {
    type: "regex",
    body: [
      {
        id: "",
        type: "character",
        kind: "string",
        value: "a",
        quantifier: { kind: "custom", min: 1, max: 2, greedy: true },
      },
    ],
    flags: [],
    withSlash: true,
  },
  "/a{1,2/": {
    type: "regex",
    body: [
      {
        id: "",
        type: "character",
        kind: "string",
        value: "a{1,2",
        quantifier: null,
      },
    ],
    flags: [],
    withSlash: true,
  },
  "/a{2,1/": {
    type: "regex",
    body: [
      {
        id: "",
        type: "character",
        kind: "string",
        value: "a{2,1",
        quantifier: null,
      },
    ],
    flags: [],
    withSlash: true,
  },
  "/a*?/": {
    type: "regex",
    body: [
      {
        id: "",
        type: "character",
        kind: "string",
        value: "a",
        quantifier: { kind: "*", min: 0, max: Infinity, greedy: false },
      },
    ],
    flags: [],
    withSlash: true,
  },
  "/a+?/": {
    type: "regex",
    body: [
      {
        id: "",
        type: "character",
        kind: "string",
        value: "a",
        quantifier: { kind: "+", min: 1, max: Infinity, greedy: false },
      },
    ],
    flags: [],
    withSlash: true,
  },
  "/a??/": {
    type: "regex",
    body: [
      {
        id: "",
        type: "character",
        kind: "string",
        value: "a",
        quantifier: { kind: "?", min: 0, max: 1, greedy: false },
      },
    ],
    flags: [],
    withSlash: true,
  },
  "/a{?/": {
    type: "regex",
    body: [
      {
        id: "",
        type: "character",
        kind: "string",
        value: "a",
        quantifier: null,
      },
      {
        id: "",
        type: "character",
        kind: "string",
        value: "{",
        quantifier: { kind: "?", min: 0, max: 1, greedy: true },
      },
    ],
    flags: [],
    withSlash: true,
  },
  "/a{}?/": {
    type: "regex",
    body: [
      {
        id: "",
        type: "character",
        kind: "string",
        value: "a{",
        quantifier: null,
      },
      {
        id: "",
        type: "character",
        kind: "string",
        value: "}",
        quantifier: { kind: "?", min: 0, max: 1, greedy: true },
      },
    ],
    flags: [],
    withSlash: true,
  },
  "/a{a}?/": {
    type: "regex",
    body: [
      {
        id: "",
        type: "character",
        kind: "string",
        value: "a{a",
        quantifier: null,
      },
      {
        id: "",
        type: "character",
        kind: "string",
        value: "}",
        quantifier: { kind: "?", min: 0, max: 1, greedy: true },
      },
    ],
    flags: [],
    withSlash: true,
  },
  "/a{1}?/": {
    type: "regex",
    body: [
      {
        id: "",
        type: "character",
        kind: "string",
        value: "a",
        quantifier: { kind: "custom", min: 1, max: 1, greedy: false },
      },
    ],
    flags: [],
    withSlash: true,
  },
  "/a{1?/": {
    type: "regex",
    body: [
      {
        id: "",
        type: "character",
        kind: "string",
        value: "a{",
        quantifier: null,
      },
      {
        id: "",
        type: "character",
        kind: "string",
        value: "1",
        quantifier: { kind: "?", min: 0, max: 1, greedy: true },
      },
    ],
    flags: [],
    withSlash: true,
  },
  "/a{1,}?/": {
    type: "regex",
    body: [
      {
        id: "",
        type: "character",
        kind: "string",
        value: "a",
        quantifier: { kind: "custom", min: 1, max: Infinity, greedy: false },
      },
    ],
    flags: [],
    withSlash: true,
  },
  "/a{1,?/": {
    type: "regex",
    body: [
      {
        id: "",
        type: "character",
        kind: "string",
        value: "a{1",
        quantifier: null,
      },
      {
        id: "",
        type: "character",
        kind: "string",
        value: ",",
        quantifier: { kind: "?", min: 0, max: 1, greedy: true },
      },
    ],
    flags: [],
    withSlash: true,
  },
  "/a{1,2}?/": {
    type: "regex",
    body: [
      {
        id: "",
        type: "character",
        kind: "string",
        value: "a",
        quantifier: { kind: "custom", min: 1, max: 2, greedy: false },
      },
    ],
    flags: [],
    withSlash: true,
  },
  "/a{1,2?/": {
    type: "regex",
    body: [
      {
        id: "",
        type: "character",
        kind: "string",
        value: "a{1,",
        quantifier: null,
      },
      {
        id: "",
        type: "character",
        kind: "string",
        value: "2",
        quantifier: { kind: "?", min: 0, max: 1, greedy: true },
      },
    ],
    flags: [],
    withSlash: true,
  },
  "/a{2,1?/": {
    type: "regex",
    body: [
      {
        id: "",
        type: "character",
        kind: "string",
        value: "a{2,",
        quantifier: null,
      },
      {
        id: "",
        type: "character",
        kind: "string",
        value: "1",
        quantifier: { kind: "?", min: 0, max: 1, greedy: true },
      },
    ],
    flags: [],
    withSlash: true,
  },
  "/👍🚀❇️/": {
    type: "regex",
    body: [
      {
        id: "",
        type: "character",
        kind: "string",
        value: "👍🚀❇️",
        quantifier: null,
      },
    ],
    flags: [],
    withSlash: true,
  },
  "/^/": {
    type: "regex",
    body: [{ id: "", type: "boundaryAssertion", kind: "beginning" }],
    flags: [],
    withSlash: true,
  },
  "/$/": {
    type: "regex",
    body: [{ id: "", type: "boundaryAssertion", kind: "end" }],
    flags: [],
    withSlash: true,
  },
  "/./": {
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
    withSlash: true,
  },
  "/]/": {
    type: "regex",
    body: [
      {
        id: "",
        type: "character",
        kind: "string",
        value: "]",
        quantifier: null,
      },
    ],
    flags: [],
    withSlash: true,
  },
  "/{/": {
    type: "regex",
    body: [
      {
        id: "",
        type: "character",
        kind: "string",
        value: "{",
        quantifier: null,
      },
    ],
    flags: [],
    withSlash: true,
  },
  "/}/": {
    type: "regex",
    body: [
      {
        id: "",
        type: "character",
        kind: "string",
        value: "}",
        quantifier: null,
      },
    ],
    flags: [],
    withSlash: true,
  },
  "/|/": {
    type: "regex",
    body: [{ id: "", type: "choice", branches: [[], []] }],
    flags: [],
    withSlash: true,
  },
  "/${1,2/": {
    type: "regex",
    body: [
      { id: "", type: "boundaryAssertion", kind: "end" },
      {
        id: "",
        type: "character",
        kind: "string",
        value: "{1,2",
        quantifier: null,
      },
    ],
    flags: [],
    withSlash: true,
  },
  "/\\1/": {
    type: "regex",
    body: [
      {
        id: "",
        type: "backReference",
        ref: "1",
      },
    ],
    flags: [],
    withSlash: true,
  },
  "/(a)\\1/": {
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
            type: "character",
            kind: "string",
            value: "a",
            quantifier: null,
          },
        ],
        quantifier: null,
      },
      {
        id: "",
        type: "backReference",
        ref: "1",
      },
    ],
    flags: [],
    withSlash: true,
  },
  "/\\1(a)/": {
    type: "regex",
    body: [
      {
        id: "",
        type: "backReference",
        ref: "1",
      },
      {
        id: "",
        type: "group",
        kind: "capturing",
        name: "1",
        index: 1,
        children: [
          {
            id: "",
            type: "character",
            kind: "string",
            value: "a",
            quantifier: null,
          },
        ],
        quantifier: null,
      },
    ],
    flags: [],
    withSlash: true,
  },
  "/(?:a)\\1/": {
    type: "regex",
    body: [
      {
        id: "",
        type: "group",
        kind: "nonCapturing",
        children: [
          {
            id: "",
            type: "character",
            kind: "string",
            value: "a",
            quantifier: null,
          },
        ],
        quantifier: null,
      },
      {
        id: "",
        type: "backReference",
        ref: "1",
      },
    ],
    flags: [],
    withSlash: true,
  },
  "/(?:a)/": {
    type: "regex",
    body: [
      {
        id: "",
        type: "group",
        kind: "nonCapturing",
        children: [
          {
            id: "",
            type: "character",
            kind: "string",
            value: "a",
            quantifier: null,
          },
        ],
        quantifier: null,
      },
    ],
    flags: [],
    withSlash: true,
  },
  "/\\d/": {
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
    withSlash: true,
  },
  "/\\D/": {
    type: "regex",
    body: [
      {
        id: "",
        type: "character",
        kind: "class",
        value: "\\D",
        quantifier: null,
      },
    ],
    flags: [],
    withSlash: true,
  },
  "/\\s/": {
    type: "regex",
    body: [
      {
        id: "",
        type: "character",
        kind: "class",
        value: "\\s",
        quantifier: null,
      },
    ],
    flags: [],
    withSlash: true,
  },
  "/\\S/": {
    type: "regex",
    body: [
      {
        id: "",
        type: "character",
        kind: "class",
        value: "\\S",
        quantifier: null,
      },
    ],
    flags: [],
    withSlash: true,
  },
  "/\\w/": {
    type: "regex",
    body: [
      {
        id: "",
        type: "character",
        kind: "class",
        value: "\\w",
        quantifier: null,
      },
    ],
    flags: [],
    withSlash: true,
  },
  "/\\W/": {
    type: "regex",
    body: [
      {
        id: "",
        type: "character",
        kind: "class",
        value: "\\W",
        quantifier: null,
      },
    ],
    flags: [],
    withSlash: true,
  },
  "/\\f/": {
    type: "regex",
    body: [
      {
        id: "",
        type: "character",
        kind: "class",
        value: "\\f",
        quantifier: null,
      },
    ],
    flags: [],
    withSlash: true,
  },
  "/\\n/": {
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
    withSlash: true,
  },
  "/\\r/": {
    type: "regex",
    body: [
      {
        id: "",
        type: "character",
        kind: "class",
        value: "\\r",
        quantifier: null,
      },
    ],
    flags: [],
    withSlash: true,
  },
  "/\\t/": {
    type: "regex",
    body: [
      {
        id: "",
        type: "character",
        kind: "class",
        value: "\\t",
        quantifier: null,
      },
    ],
    flags: [],
    withSlash: true,
  },
  "/\\v/": {
    type: "regex",
    body: [
      {
        id: "",
        type: "character",
        kind: "class",
        value: "\\v",
        quantifier: null,
      },
    ],
    flags: [],
    withSlash: true,
  },
  "/\\cA/": {
    type: "regex",
    body: [
      {
        id: "",
        type: "character",
        kind: "class",
        value: "\\cA",
        quantifier: null,
      },
    ],
    flags: [],
    withSlash: true,
  },
  "/\\cz/": {
    type: "regex",
    body: [
      {
        id: "",
        type: "character",
        kind: "class",
        value: "\\cz",
        quantifier: null,
      },
    ],
    flags: [],
    withSlash: true,
  },
  "/\\c1/": {
    type: "regex",
    body: [
      {
        id: "",
        type: "character",
        kind: "string",
        value: "c1",
        quantifier: null,
      },
    ],
    flags: [],
    withSlash: true,
  },
  "/\\c/": {
    type: "regex",
    body: [
      {
        id: "",
        type: "character",
        kind: "string",
        value: "c",
        quantifier: null,
      },
    ],
    flags: [],
    withSlash: true,
  },
  "/\\0/": {
    type: "regex",
    body: [
      {
        id: "",
        type: "character",
        kind: "class",
        value: "\\0",
        quantifier: null,
      },
    ],
    flags: [],
    withSlash: true,
  },
  "/\\u/": {
    type: "regex",
    body: [
      {
        id: "",
        type: "character",
        kind: "string",
        value: "u",
        quantifier: null,
      },
    ],
    flags: [],
    withSlash: true,
  },
  "/\\u1/": {
    type: "regex",
    body: [
      {
        id: "",
        type: "character",
        kind: "string",
        value: "u1",
        quantifier: null,
      },
    ],
    flags: [],
    withSlash: true,
  },
  "/\\u12/": {
    type: "regex",
    body: [
      {
        id: "",
        type: "character",
        kind: "string",
        value: "u12",
        quantifier: null,
      },
    ],
    flags: [],
    withSlash: true,
  },
  "/\\u123/": {
    type: "regex",
    body: [
      {
        id: "",
        type: "character",
        kind: "string",
        value: "u123",
        quantifier: null,
      },
    ],
    flags: [],
    withSlash: true,
  },
  "/\\u1234/": {
    type: "regex",
    body: [
      {
        id: "",
        type: "character",
        kind: "class",
        value: "\\u1234",
        quantifier: null,
      },
    ],
    flags: [],
    withSlash: true,
  },
  "/\\u12345/": {
    type: "regex",
    body: [
      {
        id: "",
        type: "character",
        kind: "class",
        value: "\\u1234",
        quantifier: null,
      },
      {
        id: "",
        type: "character",
        kind: "string",
        value: "5",
        quantifier: null,
      },
    ],
    flags: [],
    withSlash: true,
  },
  "/\\u{/": {
    type: "regex",
    body: [
      {
        id: "",
        type: "character",
        kind: "string",
        value: "u{",
        quantifier: null,
      },
    ],
    flags: [],
    withSlash: true,
  },
  "/\\u{z/": {
    type: "regex",
    body: [
      {
        id: "",
        type: "character",
        kind: "string",
        value: "u{z",
        quantifier: null,
      },
    ],
    flags: [],
    withSlash: true,
  },
  "/\\u{a}/": {
    type: "regex",
    body: [
      {
        id: "",
        type: "character",
        kind: "string",
        value: "u{a}",
        quantifier: null,
      },
    ],
    flags: [],
    withSlash: true,
  },
  "/\\u{20/": {
    type: "regex",
    body: [
      {
        id: "",
        type: "character",
        kind: "string",
        value: "u{20",
        quantifier: null,
      },
    ],
    flags: [],
    withSlash: true,
  },
  "/\\u{20}/": {
    type: "regex",
    body: [
      {
        id: "",
        type: "character",
        kind: "string",
        value: "u",
        quantifier: { kind: "custom", min: 20, max: 20, greedy: true },
      },
    ],
    flags: [],
    withSlash: true,
  },
  "/\\377/": {
    type: "regex",
    body: [
      {
        id: "",
        type: "backReference",
        ref: "377",
      },
    ],
    flags: [],
    withSlash: true,
  },
  "/\\400/": {
    type: "regex",
    body: [
      {
        id: "",
        type: "backReference",
        ref: "400",
      },
    ],
    flags: [],
    withSlash: true,
  },
  "/\\^/": {
    type: "regex",
    body: [
      {
        id: "",
        type: "character",
        kind: "string",
        value: "^",
        quantifier: null,
      },
    ],
    flags: [],
    withSlash: true,
  },
  "/\\$/": {
    type: "regex",
    body: [
      {
        id: "",
        type: "character",
        kind: "string",
        value: "$",
        quantifier: null,
      },
    ],
    flags: [],
    withSlash: true,
  },
  "/\\./": {
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
    withSlash: true,
  },
  "/\\+/": {
    type: "regex",
    body: [
      {
        id: "",
        type: "character",
        kind: "string",
        value: "+",
        quantifier: null,
      },
    ],
    flags: [],
    withSlash: true,
  },
  "/\\?/": {
    type: "regex",
    body: [
      {
        id: "",
        type: "character",
        kind: "string",
        value: "?",
        quantifier: null,
      },
    ],
    flags: [],
    withSlash: true,
  },
  "/\\(/": {
    type: "regex",
    body: [
      {
        id: "",
        type: "character",
        kind: "string",
        value: "(",
        quantifier: null,
      },
    ],
    flags: [],
    withSlash: true,
  },
  "/\\)/": {
    type: "regex",
    body: [
      {
        id: "",
        type: "character",
        kind: "string",
        value: ")",
        quantifier: null,
      },
    ],
    flags: [],
    withSlash: true,
  },
  "/\\[/": {
    type: "regex",
    body: [
      {
        id: "",
        type: "character",
        kind: "string",
        value: "[",
        quantifier: null,
      },
    ],
    flags: [],
    withSlash: true,
  },
  "/\\]/": {
    type: "regex",
    body: [
      {
        id: "",
        type: "character",
        kind: "string",
        value: "]",
        quantifier: null,
      },
    ],
    flags: [],
    withSlash: true,
  },
  "/\\{/": {
    type: "regex",
    body: [
      {
        id: "",
        type: "character",
        kind: "string",
        value: "{",
        quantifier: null,
      },
    ],
    flags: [],
    withSlash: true,
  },
  "/\\}/": {
    type: "regex",
    body: [
      {
        id: "",
        type: "character",
        kind: "string",
        value: "}",
        quantifier: null,
      },
    ],
    flags: [],
    withSlash: true,
  },
  "/\\|/": {
    type: "regex",
    body: [
      {
        id: "",
        type: "character",
        kind: "string",
        value: "|",
        quantifier: null,
      },
    ],
    flags: [],
    withSlash: true,
  },
  "/\\//": {
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
    withSlash: true,
  },
  "/\\a/": {
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
    withSlash: true,
  },
  "/[]/": {
    type: "regex",
    body: [
      {
        id: "",
        type: "character",
        kind: "ranges",
        ranges: [],
        negate: false,
        quantifier: null,
      },
    ],
    flags: [],
    withSlash: true,
  },
  "/[^-a-b-]/": {
    type: "regex",
    body: [
      {
        id: "",
        type: "character",
        kind: "ranges",
        ranges: [
          { from: "-", to: "-" },
          { from: "a", to: "b" },
          { from: "-", to: "-" },
        ],
        negate: true,
        quantifier: null,
      },
    ],
    flags: [],
    withSlash: true,
  },
  "/[-]/": {
    type: "regex",
    body: [
      {
        id: "",
        type: "character",
        kind: "ranges",
        ranges: [{ from: "-", to: "-" }],
        negate: false,
        quantifier: null,
      },
    ],
    flags: [],
    withSlash: true,
  },
  "/[a]/": {
    type: "regex",
    body: [
      {
        id: "",
        type: "character",
        kind: "ranges",
        ranges: [{ from: "a", to: "a" }],
        negate: false,
        quantifier: null,
      },
    ],
    flags: [],
    withSlash: true,
  },
  "/[--]/": {
    type: "regex",
    body: [
      {
        id: "",
        type: "character",
        kind: "ranges",
        ranges: [
          { from: "-", to: "-" },
          { from: "-", to: "-" },
        ],
        negate: false,
        quantifier: null,
      },
    ],
    flags: [],
    withSlash: true,
  },
  "/[-a]/": {
    type: "regex",
    body: [
      {
        id: "",
        type: "character",
        kind: "ranges",
        ranges: [
          { from: "-", to: "-" },
          { from: "a", to: "a" },
        ],
        negate: false,
        quantifier: null,
      },
    ],
    flags: [],
    withSlash: true,
  },
  "/[-a-]/": {
    type: "regex",
    body: [
      {
        id: "",
        type: "character",
        kind: "ranges",
        ranges: [
          { from: "-", to: "-" },
          { from: "a", to: "a" },
          { from: "-", to: "-" },
        ],
        negate: false,
        quantifier: null,
      },
    ],
    flags: [],
    withSlash: true,
  },
  "/[a-]/": {
    type: "regex",
    body: [
      {
        id: "",
        type: "character",
        kind: "ranges",
        ranges: [
          { from: "a", to: "a" },
          { from: "-", to: "-" },
        ],
        negate: false,
        quantifier: null,
      },
    ],
    flags: [],
    withSlash: true,
  },
  "/[a-b]/": {
    type: "regex",
    body: [
      {
        id: "",
        type: "character",
        kind: "ranges",
        ranges: [{ from: "a", to: "b" }],
        negate: false,
        quantifier: null,
      },
    ],
    flags: [],
    withSlash: true,
  },
  "/[-a-b-]/": {
    type: "regex",
    body: [
      {
        id: "",
        type: "character",
        kind: "ranges",
        ranges: [
          { from: "-", to: "-" },
          { from: "a", to: "b" },
          { from: "-", to: "-" },
        ],
        negate: false,
        quantifier: null,
      },
    ],
    flags: [],
    withSlash: true,
  },
  "/[---]/": {
    type: "regex",
    body: [
      {
        id: "",
        type: "character",
        kind: "ranges",
        ranges: [{ from: "-", to: "-" }],
        negate: false,
        quantifier: null,
      },
    ],
    flags: [],
    withSlash: true,
  },
  "/[a-b--/]/": {
    type: "regex",
    body: [
      {
        id: "",
        type: "character",
        kind: "ranges",
        ranges: [
          { from: "a", to: "b" },
          { from: "-", to: "/" },
        ],
        negate: false,
        quantifier: null,
      },
    ],
    flags: [],
    withSlash: true,
  },
  "/[\\b-\\n]/": {
    type: "regex",
    body: [
      {
        id: "",
        type: "character",
        kind: "ranges",
        ranges: [{ from: "\\b", to: "\\n" }],
        negate: false,
        quantifier: null,
      },
    ],
    flags: [],
    withSlash: true,
  },
  "/[b\\-a]/": {
    type: "regex",
    body: [
      {
        id: "",
        type: "character",
        kind: "ranges",
        ranges: [
          { from: "b", to: "b" },
          { from: "-", to: "-" },
          { from: "a", to: "a" },
        ],
        negate: false,
        quantifier: null,
      },
    ],
    flags: [],
    withSlash: true,
  },
  "/[\\d]/": {
    type: "regex",
    body: [
      {
        id: "",
        type: "character",
        kind: "ranges",
        ranges: [{ from: "\\d", to: "\\d" }],
        negate: false,
        quantifier: null,
      },
    ],
    flags: [],
    withSlash: true,
  },
  "/[\\D]/": {
    type: "regex",
    body: [
      {
        id: "",
        type: "character",
        kind: "ranges",
        ranges: [{ from: "\\D", to: "\\D" }],
        negate: false,
        quantifier: null,
      },
    ],
    flags: [],
    withSlash: true,
  },
  "/[\\s]/": {
    type: "regex",
    body: [
      {
        id: "",
        type: "character",
        kind: "ranges",
        ranges: [{ from: "\\s", to: "\\s" }],
        negate: false,
        quantifier: null,
      },
    ],
    flags: [],
    withSlash: true,
  },
  "/[\\S]/": {
    type: "regex",
    body: [
      {
        id: "",
        type: "character",
        kind: "ranges",
        ranges: [{ from: "\\S", to: "\\S" }],
        negate: false,
        quantifier: null,
      },
    ],
    flags: [],
    withSlash: true,
  },
  "/[\\w]/": {
    type: "regex",
    body: [
      {
        id: "",
        type: "character",
        kind: "ranges",
        ranges: [{ from: "\\w", to: "\\w" }],
        negate: false,
        quantifier: null,
      },
    ],
    flags: [],
    withSlash: true,
  },
  "/[\\W]/": {
    type: "regex",
    body: [
      {
        id: "",
        type: "character",
        kind: "ranges",
        ranges: [{ from: "\\W", to: "\\W" }],
        negate: false,
        quantifier: null,
      },
    ],
    flags: [],
    withSlash: true,
  },
  "/[\\f]/": {
    type: "regex",
    body: [
      {
        id: "",
        type: "character",
        kind: "ranges",
        ranges: [{ from: "\\f", to: "\\f" }],
        negate: false,
        quantifier: null,
      },
    ],
    flags: [],
    withSlash: true,
  },
  "/[\\n]/": {
    type: "regex",
    body: [
      {
        id: "",
        type: "character",
        kind: "ranges",
        ranges: [{ from: "\\n", to: "\\n" }],
        negate: false,
        quantifier: null,
      },
    ],
    flags: [],
    withSlash: true,
  },
  "/[\\r]/": {
    type: "regex",
    body: [
      {
        id: "",
        type: "character",
        kind: "ranges",
        ranges: [{ from: "\\r", to: "\\r" }],
        negate: false,
        quantifier: null,
      },
    ],
    flags: [],
    withSlash: true,
  },
  "/[\\t]/": {
    type: "regex",
    body: [
      {
        id: "",
        type: "character",
        kind: "ranges",
        ranges: [{ from: "\\t", to: "\\t" }],
        negate: false,
        quantifier: null,
      },
    ],
    flags: [],
    withSlash: true,
  },
  "/[\\v]/": {
    type: "regex",
    body: [
      {
        id: "",
        type: "character",
        kind: "ranges",
        ranges: [{ from: "\\v", to: "\\v" }],
        negate: false,
        quantifier: null,
      },
    ],
    flags: [],
    withSlash: true,
  },
  "/[\\cA]/": {
    type: "regex",
    body: [
      {
        id: "",
        type: "character",
        kind: "ranges",
        ranges: [{ from: "\\cA", to: "\\cA" }],
        negate: false,
        quantifier: null,
      },
    ],
    flags: [],
    withSlash: true,
  },
  "/[\\cz]/": {
    type: "regex",
    body: [
      {
        id: "",
        type: "character",
        kind: "ranges",
        ranges: [{ from: "\\cz", to: "\\cz" }],
        negate: false,
        quantifier: null,
      },
    ],
    flags: [],
    withSlash: true,
  },
  "/[\\c1]/": {
    type: "regex",
    body: [
      {
        id: "",
        type: "character",
        kind: "ranges",
        ranges: [
          { from: "c", to: "c" },
          { from: "1", to: "1" },
        ],
        negate: false,
        quantifier: null,
      },
    ],
    flags: [],
    withSlash: true,
  },
  "/[\\c]/": {
    type: "regex",
    body: [
      {
        id: "",
        type: "character",
        kind: "ranges",
        ranges: [{ from: "c", to: "c" }],
        negate: false,
        quantifier: null,
      },
    ],
    flags: [],
    withSlash: true,
  },
  "/[\\0]/": {
    type: "regex",
    body: [
      {
        id: "",
        type: "character",
        kind: "ranges",
        ranges: [{ from: "\\0", to: "\\0" }],
        negate: false,
        quantifier: null,
      },
    ],
    flags: [],
    withSlash: true,
  },
  "/[\\x]/": {
    type: "regex",
    body: [
      {
        id: "",
        type: "character",
        kind: "ranges",
        ranges: [{ from: "x", to: "x" }],
        negate: false,
        quantifier: null,
      },
    ],
    flags: [],
    withSlash: true,
  },
  "/[\\xz]/": {
    type: "regex",
    body: [
      {
        id: "",
        type: "character",
        kind: "ranges",
        ranges: [
          { from: "x", to: "x" },
          { from: "z", to: "z" },
        ],
        negate: false,
        quantifier: null,
      },
    ],
    flags: [],
    withSlash: true,
  },
  "/[\\x1]/": {
    type: "regex",
    body: [
      {
        id: "",
        type: "character",
        kind: "ranges",
        ranges: [
          { from: "x", to: "x" },
          { from: "1", to: "1" },
        ],
        negate: false,
        quantifier: null,
      },
    ],
    flags: [],
    withSlash: true,
  },
  "/[\\x12]/": {
    type: "regex",
    body: [
      {
        id: "",
        type: "character",
        kind: "ranges",
        ranges: [{ from: "\\x12", to: "\\x12" }],
        negate: false,
        quantifier: null,
      },
    ],
    flags: [],
    withSlash: true,
  },
  "/[\\x123]/": {
    type: "regex",
    body: [
      {
        id: "",
        type: "character",
        kind: "ranges",
        ranges: [
          { from: "\\x12", to: "\\x12" },
          { from: "3", to: "3" },
        ],
        negate: false,
        quantifier: null,
      },
    ],
    flags: [],
    withSlash: true,
  },
  "/[\\u]/": {
    type: "regex",
    body: [
      {
        id: "",
        type: "character",
        kind: "ranges",
        ranges: [{ from: "u", to: "u" }],
        negate: false,
        quantifier: null,
      },
    ],
    flags: [],
    withSlash: true,
  },
  "/[\\u1]/": {
    type: "regex",
    body: [
      {
        id: "",
        type: "character",
        kind: "ranges",
        ranges: [
          { from: "u", to: "u" },
          { from: "1", to: "1" },
        ],
        negate: false,
        quantifier: null,
      },
    ],
    flags: [],
    withSlash: true,
  },
  "/[\\u12]/": {
    type: "regex",
    body: [
      {
        id: "",
        type: "character",
        kind: "ranges",
        ranges: [
          { from: "u", to: "u" },
          { from: "1", to: "1" },
          { from: "2", to: "2" },
        ],
        negate: false,
        quantifier: null,
      },
    ],
    flags: [],
    withSlash: true,
  },
  "/[\\u123]/": {
    type: "regex",
    body: [
      {
        id: "",
        type: "character",
        kind: "ranges",
        ranges: [
          { from: "u", to: "u" },
          { from: "1", to: "1" },
          { from: "2", to: "2" },
          { from: "3", to: "3" },
        ],
        negate: false,
        quantifier: null,
      },
    ],
    flags: [],
    withSlash: true,
  },
  "/[\\u1234]/": {
    type: "regex",
    body: [
      {
        id: "",
        type: "character",
        kind: "ranges",
        ranges: [{ from: "\\u1234", to: "\\u1234" }],
        negate: false,
        quantifier: null,
      },
    ],
    flags: [],
    withSlash: true,
  },
  "/[\\u12345]/": {
    type: "regex",
    body: [
      {
        id: "",
        type: "character",
        kind: "ranges",
        ranges: [
          { from: "\\u1234", to: "\\u1234" },
          { from: "5", to: "5" },
        ],
        negate: false,
        quantifier: null,
      },
    ],
    flags: [],
    withSlash: true,
  },
  "/[\\u{]/": {
    type: "regex",
    body: [
      {
        id: "",
        type: "character",
        kind: "ranges",
        ranges: [
          { from: "u", to: "u" },
          { from: "{", to: "{" },
        ],
        negate: false,
        quantifier: null,
      },
    ],
    flags: [],
    withSlash: true,
  },
  "/[\\u{z]/": {
    type: "regex",
    body: [
      {
        id: "",
        type: "character",
        kind: "ranges",
        ranges: [
          { from: "u", to: "u" },
          { from: "{", to: "{" },
          { from: "z", to: "z" },
        ],
        negate: false,
        quantifier: null,
      },
    ],
    flags: [],
    withSlash: true,
  },
  "/[\\u{a}]/": {
    type: "regex",
    body: [
      {
        id: "",
        type: "character",
        kind: "ranges",
        ranges: [
          { from: "u", to: "u" },
          { from: "{", to: "{" },
          { from: "a", to: "a" },
          { from: "}", to: "}" },
        ],
        negate: false,
        quantifier: null,
      },
    ],
    flags: [],
    withSlash: true,
  },
  "/[\\u{20]/": {
    type: "regex",
    body: [
      {
        id: "",
        type: "character",
        kind: "ranges",
        ranges: [
          { from: "u", to: "u" },
          { from: "{", to: "{" },
          { from: "2", to: "2" },
          { from: "0", to: "0" },
        ],
        negate: false,
        quantifier: null,
      },
    ],
    flags: [],
    withSlash: true,
  },
  "/[\\u{20}]/": {
    type: "regex",
    body: [
      {
        id: "",
        type: "character",
        kind: "ranges",
        ranges: [
          { from: "u", to: "u" },
          { from: "{", to: "{" },
          { from: "2", to: "2" },
          { from: "0", to: "0" },
          { from: "}", to: "}" },
        ],
        negate: false,
        quantifier: null,
      },
    ],
    flags: [],
    withSlash: true,
  },
  "/[\\77]/": {
    type: "regex",
    body: [
      {
        id: "",
        type: "character",
        kind: "ranges",
        ranges: [
          { from: "7", to: "7" },
          { from: "7", to: "7" },
        ],
        negate: false,
        quantifier: null,
      },
    ],
    flags: [],
    withSlash: true,
  },
  "/[\\377]/": {
    type: "regex",
    body: [
      {
        id: "",
        type: "character",
        kind: "ranges",
        ranges: [
          { from: "3", to: "3" },
          { from: "7", to: "7" },
          { from: "7", to: "7" },
        ],
        negate: false,
        quantifier: null,
      },
    ],
    flags: [],
    withSlash: true,
  },
  "/[\\400]/": {
    type: "regex",
    body: [
      {
        id: "",
        type: "character",
        kind: "ranges",
        ranges: [
          { from: "4", to: "4" },
          { from: "0", to: "0" },
          { from: "0", to: "0" },
        ],
        negate: false,
        quantifier: null,
      },
    ],
    flags: [],
    withSlash: true,
  },
  "/[\\^]/": {
    type: "regex",
    body: [
      {
        id: "",
        type: "character",
        kind: "ranges",
        ranges: [{ from: "^", to: "^" }],
        negate: false,
        quantifier: null,
      },
    ],
    flags: [],
    withSlash: true,
  },
  "/[\\$]/": {
    type: "regex",
    body: [
      {
        id: "",
        type: "character",
        kind: "ranges",
        ranges: [{ from: "$", to: "$" }],
        negate: false,
        quantifier: null,
      },
    ],
    flags: [],
    withSlash: true,
  },
  "/[\\.]/": {
    type: "regex",
    body: [
      {
        id: "",
        type: "character",
        kind: "ranges",
        ranges: [{ from: ".", to: "." }],
        negate: false,
        quantifier: null,
      },
    ],
    flags: [],
    withSlash: true,
  },
  "/[\\+]/": {
    type: "regex",
    body: [
      {
        id: "",
        type: "character",
        kind: "ranges",
        ranges: [{ from: "+", to: "+" }],
        negate: false,
        quantifier: null,
      },
    ],
    flags: [],
    withSlash: true,
  },
  "/[\\?]/": {
    type: "regex",
    body: [
      {
        id: "",
        type: "character",
        kind: "ranges",
        ranges: [{ from: "?", to: "?" }],
        negate: false,
        quantifier: null,
      },
    ],
    flags: [],
    withSlash: true,
  },
  "/[\\(]/": {
    type: "regex",
    body: [
      {
        id: "",
        type: "character",
        kind: "ranges",
        ranges: [{ from: "(", to: "(" }],
        negate: false,
        quantifier: null,
      },
    ],
    flags: [],
    withSlash: true,
  },
  "/[\\)]/": {
    type: "regex",
    body: [
      {
        id: "",
        type: "character",
        kind: "ranges",
        ranges: [{ from: ")", to: ")" }],
        negate: false,
        quantifier: null,
      },
    ],
    flags: [],
    withSlash: true,
  },
  "/[\\[]/": {
    type: "regex",
    body: [
      {
        id: "",
        type: "character",
        kind: "ranges",
        ranges: [{ from: "[", to: "[" }],
        negate: false,
        quantifier: null,
      },
    ],
    flags: [],
    withSlash: true,
  },
  "/[\\]]/": {
    type: "regex",
    body: [
      {
        id: "",
        type: "character",
        kind: "ranges",
        ranges: [{ from: "]", to: "]" }],
        negate: false,
        quantifier: null,
      },
    ],
    flags: [],
    withSlash: true,
  },
  "/[\\{]/": {
    type: "regex",
    body: [
      {
        id: "",
        type: "character",
        kind: "ranges",
        ranges: [{ from: "{", to: "{" }],
        negate: false,
        quantifier: null,
      },
    ],
    flags: [],
    withSlash: true,
  },
  "/[\\}]/": {
    type: "regex",
    body: [
      {
        id: "",
        type: "character",
        kind: "ranges",
        ranges: [{ from: "}", to: "}" }],
        negate: false,
        quantifier: null,
      },
    ],
    flags: [],
    withSlash: true,
  },
  "/[\\|]/": {
    type: "regex",
    body: [
      {
        id: "",
        type: "character",
        kind: "ranges",
        ranges: [{ from: "|", to: "|" }],
        negate: false,
        quantifier: null,
      },
    ],
    flags: [],
    withSlash: true,
  },
  "/[\\/]/": {
    type: "regex",
    body: [
      {
        id: "",
        type: "character",
        kind: "ranges",
        ranges: [{ from: "/", to: "/" }],
        negate: false,
        quantifier: null,
      },
    ],
    flags: [],
    withSlash: true,
  },
  "/[\\a]/": {
    type: "regex",
    body: [
      {
        id: "",
        type: "character",
        kind: "ranges",
        ranges: [{ from: "a", to: "a" }],
        negate: false,
        quantifier: null,
      },
    ],
    flags: [],
    withSlash: true,
  },
  "/[\\d-\\uFFFF]/": {
    type: "regex",
    body: [
      {
        id: "",
        type: "character",
        kind: "ranges",
        ranges: [{ from: "\\d", to: "\\uFFFF" }],
        negate: false,
        quantifier: null,
      },
    ],
    flags: [],
    withSlash: true,
  },
  "/[\\D-\\uFFFF]/": {
    type: "regex",
    body: [
      {
        id: "",
        type: "character",
        kind: "ranges",
        ranges: [{ from: "\\D", to: "\\uFFFF" }],
        negate: false,
        quantifier: null,
      },
    ],
    flags: [],
    withSlash: true,
  },
  "/[\\s-\\uFFFF]/": {
    type: "regex",
    body: [
      {
        id: "",
        type: "character",
        kind: "ranges",
        ranges: [{ from: "\\s", to: "\\uFFFF" }],
        negate: false,
        quantifier: null,
      },
    ],
    flags: [],
    withSlash: true,
  },
  "/[\\S-\\uFFFF]/": {
    type: "regex",
    body: [
      {
        id: "",
        type: "character",
        kind: "ranges",
        ranges: [{ from: "\\S", to: "\\uFFFF" }],
        negate: false,
        quantifier: null,
      },
    ],
    flags: [],
    withSlash: true,
  },
  "/[\\w-\\uFFFF]/": {
    type: "regex",
    body: [
      {
        id: "",
        type: "character",
        kind: "ranges",
        ranges: [{ from: "\\w", to: "\\uFFFF" }],
        negate: false,
        quantifier: null,
      },
    ],
    flags: [],
    withSlash: true,
  },
  "/[\\W-\\uFFFF]/": {
    type: "regex",
    body: [
      {
        id: "",
        type: "character",
        kind: "ranges",
        ranges: [{ from: "\\W", to: "\\uFFFF" }],
        negate: false,
        quantifier: null,
      },
    ],
    flags: [],
    withSlash: true,
  },
  "/[\\u0000-\\d]/": {
    type: "regex",
    body: [
      {
        id: "",
        type: "character",
        kind: "ranges",
        ranges: [{ from: "\\u0000", to: "\\d" }],
        negate: false,
        quantifier: null,
      },
    ],
    flags: [],
    withSlash: true,
  },
  "/[\\u0000-\\D]/": {
    type: "regex",
    body: [
      {
        id: "",
        type: "character",
        kind: "ranges",
        ranges: [{ from: "\\u0000", to: "\\D" }],
        negate: false,
        quantifier: null,
      },
    ],
    flags: [],
    withSlash: true,
  },
  "/[\\u0000-\\s]/": {
    type: "regex",
    body: [
      {
        id: "",
        type: "character",
        kind: "ranges",
        ranges: [{ from: "\\u0000", to: "\\s" }],
        negate: false,
        quantifier: null,
      },
    ],
    flags: [],
    withSlash: true,
  },
  "/[\\u0000-\\S]/": {
    type: "regex",
    body: [
      {
        id: "",
        type: "character",
        kind: "ranges",
        ranges: [{ from: "\\u0000", to: "\\S" }],
        negate: false,
        quantifier: null,
      },
    ],
    flags: [],
    withSlash: true,
  },
  "/[\\u0000-\\w]/": {
    type: "regex",
    body: [
      {
        id: "",
        type: "character",
        kind: "ranges",
        ranges: [{ from: "\\u0000", to: "\\w" }],
        negate: false,
        quantifier: null,
      },
    ],
    flags: [],
    withSlash: true,
  },
  "/[\\u0000-\\W]/": {
    type: "regex",
    body: [
      {
        id: "",
        type: "character",
        kind: "ranges",
        ranges: [{ from: "\\u0000", to: "\\W" }],
        negate: false,
        quantifier: null,
      },
    ],
    flags: [],
    withSlash: true,
  },
  "/[\\u0000-\\u0001]/": {
    type: "regex",
    body: [
      {
        id: "",
        type: "character",
        kind: "ranges",
        ranges: [{ from: "\\u0000", to: "\\u0001" }],
        negate: false,
        quantifier: null,
      },
    ],
    flags: [],
    withSlash: true,
  },
  "/[\\u{2-\\u{1}]/": {
    type: "regex",
    body: [
      {
        id: "",
        type: "character",
        kind: "ranges",
        ranges: [
          { from: "u", to: "u" },
          { from: "{", to: "{" },
          { from: "2", to: "u" },
          { from: "{", to: "{" },
          { from: "1", to: "1" },
          { from: "}", to: "}" },
        ],
        negate: false,
        quantifier: null,
      },
    ],
    flags: [],
    withSlash: true,
  },
  "/[\\a-\\z]/": {
    type: "regex",
    body: [
      {
        id: "",
        type: "character",
        kind: "ranges",
        ranges: [{ from: "a", to: "z" }],
        negate: false,
        quantifier: null,
      },
    ],
    flags: [],
    withSlash: true,
  },
  "/[0-9--/]/": {
    type: "regex",
    body: [
      {
        id: "",
        type: "character",
        kind: "ranges",
        ranges: [
          { from: "0", to: "9" },
          { from: "-", to: "/" },
        ],
        negate: false,
        quantifier: null,
      },
    ],
    flags: [],
    withSlash: true,
  },
  "/[\\c0-\\u001f]/": {
    type: "regex",
    body: [
      {
        id: "",
        type: "character",
        kind: "ranges",
        ranges: [
          { from: "c", to: "c" },
          { from: "0", to: "\\u001f" },
        ],
        negate: false,
        quantifier: null,
      },
    ],
    flags: [],
    withSlash: true,
  },
  "/[\\c_]/": {
    type: "regex",
    body: [
      {
        id: "",
        type: "character",
        kind: "ranges",
        ranges: [
          { from: "c", to: "c" },
          { from: "_", to: "_" },
        ],
        negate: false,
        quantifier: null,
      },
    ],
    flags: [],
    withSlash: true,
  },
  "/^[0-9]*$/": {
    type: "regex",
    body: [
      { id: "", type: "boundaryAssertion", kind: "beginning" },
      {
        id: "",
        type: "character",
        kind: "ranges",
        ranges: [{ from: "0", to: "9" }],
        negate: false,
        quantifier: { kind: "*", min: 0, max: Infinity, greedy: true },
      },
      { id: "", type: "boundaryAssertion", kind: "end" },
    ],
    flags: [],
    withSlash: true,
  },
  "/^[0-9]+$/": {
    type: "regex",
    body: [
      { id: "", type: "boundaryAssertion", kind: "beginning" },
      {
        id: "",
        type: "character",
        kind: "ranges",
        ranges: [{ from: "0", to: "9" }],
        negate: false,
        quantifier: { kind: "+", min: 1, max: Infinity, greedy: true },
      },
      { id: "", type: "boundaryAssertion", kind: "end" },
    ],
    flags: [],
    withSlash: true,
  },
  "/^[a-zA-Z]*$/": {
    type: "regex",
    body: [
      { id: "", type: "boundaryAssertion", kind: "beginning" },
      {
        id: "",
        type: "character",
        kind: "ranges",
        ranges: [
          { from: "a", to: "z" },
          { from: "A", to: "Z" },
        ],
        negate: false,
        quantifier: { kind: "*", min: 0, max: Infinity, greedy: true },
      },
      { id: "", type: "boundaryAssertion", kind: "end" },
    ],
    flags: [],
    withSlash: true,
  },
  "/^[a-zA-Z]+$/": {
    type: "regex",
    body: [
      { id: "", type: "boundaryAssertion", kind: "beginning" },
      {
        id: "",
        type: "character",
        kind: "ranges",
        ranges: [
          { from: "a", to: "z" },
          { from: "A", to: "Z" },
        ],
        negate: false,
        quantifier: { kind: "+", min: 1, max: Infinity, greedy: true },
      },
      { id: "", type: "boundaryAssertion", kind: "end" },
    ],
    flags: [],
    withSlash: true,
  },
  "/^[0-9a-zA-Z]*$/": {
    type: "regex",
    body: [
      { id: "", type: "boundaryAssertion", kind: "beginning" },
      {
        id: "",
        type: "character",
        kind: "ranges",
        ranges: [
          { from: "0", to: "9" },
          { from: "a", to: "z" },
          { from: "A", to: "Z" },
        ],
        negate: false,
        quantifier: { kind: "*", min: 0, max: Infinity, greedy: true },
      },
      { id: "", type: "boundaryAssertion", kind: "end" },
    ],
    flags: [],
    withSlash: true,
  },
  "/^[a-zA-Z0-9!-/:-@\\[-`{-~]*$/": {
    type: "regex",
    body: [
      { id: "", type: "boundaryAssertion", kind: "beginning" },
      {
        id: "",
        type: "character",
        kind: "ranges",
        ranges: [
          { from: "a", to: "z" },
          { from: "A", to: "Z" },
          { from: "0", to: "9" },
          { from: "!", to: "/" },
          { from: ":", to: "@" },
          { from: "[", to: "`" },
          { from: "{", to: "~" },
        ],
        negate: false,
        quantifier: { kind: "*", min: 0, max: Infinity, greedy: true },
      },
      { id: "", type: "boundaryAssertion", kind: "end" },
    ],
    flags: [],
    withSlash: true,
  },
  "/^([a-zA-Z0-9]{8,})$/": {
    type: "regex",
    body: [
      { id: "", type: "boundaryAssertion", kind: "beginning" },
      {
        id: "",
        type: "group",
        kind: "capturing",
        name: "1",
        index: 1,
        children: [
          {
            id: "",
            type: "character",
            kind: "ranges",
            ranges: [
              { from: "a", to: "z" },
              { from: "A", to: "Z" },
              { from: "0", to: "9" },
            ],
            negate: false,
            quantifier: { kind: "custom", min: 8, max: Infinity, greedy: true },
          },
        ],
        quantifier: null,
      },
      { id: "", type: "boundaryAssertion", kind: "end" },
    ],
    flags: [],
    withSlash: true,
  },
  "/^([a-zA-Z0-9]{6,8})$/": {
    type: "regex",
    body: [
      { id: "", type: "boundaryAssertion", kind: "beginning" },
      {
        id: "",
        type: "group",
        kind: "capturing",
        name: "1",
        index: 1,
        children: [
          {
            id: "",
            type: "character",
            kind: "ranges",
            ranges: [
              { from: "a", to: "z" },
              { from: "A", to: "Z" },
              { from: "0", to: "9" },
            ],
            negate: false,
            quantifier: { kind: "custom", min: 6, max: 8, greedy: true },
          },
        ],
        quantifier: null,
      },
      { id: "", type: "boundaryAssertion", kind: "end" },
    ],
    flags: [],
    withSlash: true,
  },
  "/^([0-9]{0,8})$/": {
    type: "regex",
    body: [
      { id: "", type: "boundaryAssertion", kind: "beginning" },
      {
        id: "",
        type: "group",
        kind: "capturing",
        name: "1",
        index: 1,
        children: [
          {
            id: "",
            type: "character",
            kind: "ranges",
            ranges: [{ from: "0", to: "9" }],
            negate: false,
            quantifier: { kind: "custom", min: 0, max: 8, greedy: true },
          },
        ],
        quantifier: null,
      },
      { id: "", type: "boundaryAssertion", kind: "end" },
    ],
    flags: [],
    withSlash: true,
  },
  "/^[0-9]{8}$/": {
    type: "regex",
    body: [
      { id: "", type: "boundaryAssertion", kind: "beginning" },
      {
        id: "",
        type: "character",
        kind: "ranges",
        ranges: [{ from: "0", to: "9" }],
        negate: false,
        quantifier: { kind: "custom", min: 8, max: 8, greedy: true },
      },
      { id: "", type: "boundaryAssertion", kind: "end" },
    ],
    flags: [],
    withSlash: true,
  },
  "/^https?:\\/\\//": {
    type: "regex",
    body: [
      { id: "", type: "boundaryAssertion", kind: "beginning" },
      {
        id: "",
        type: "character",
        kind: "string",
        value: "http",
        quantifier: null,
      },
      {
        id: "",
        type: "character",
        kind: "string",
        value: "s",
        quantifier: { kind: "?", min: 0, max: 1, greedy: true },
      },
      {
        id: "",
        type: "character",
        kind: "string",
        value: "://",
        quantifier: null,
      },
    ],
    flags: [],
    withSlash: true,
  },
  "/^\\d{3}-\\d{4}$/": {
    type: "regex",
    body: [
      { id: "", type: "boundaryAssertion", kind: "beginning" },
      {
        id: "",
        type: "character",
        kind: "class",
        value: "\\d",
        quantifier: { kind: "custom", min: 3, max: 3, greedy: true },
      },
      {
        id: "",
        type: "character",
        kind: "string",
        value: "-",
        quantifier: null,
      },
      {
        id: "",
        type: "character",
        kind: "class",
        value: "\\d",
        quantifier: { kind: "custom", min: 4, max: 4, greedy: true },
      },
      { id: "", type: "boundaryAssertion", kind: "end" },
    ],
    flags: [],
    withSlash: true,
  },
  "/^\\d{1,3}(.\\d{1,3}){3}$/": {
    type: "regex",
    body: [
      { id: "", type: "boundaryAssertion", kind: "beginning" },
      {
        id: "",
        type: "character",
        kind: "class",
        value: "\\d",
        quantifier: { kind: "custom", min: 1, max: 3, greedy: true },
      },
      {
        id: "",
        type: "group",
        kind: "capturing",
        name: "1",
        index: 1,
        children: [
          {
            id: "",
            type: "character",
            kind: "class",
            value: ".",
            quantifier: null,
          },
          {
            id: "",
            type: "character",
            kind: "class",
            value: "\\d",
            quantifier: { kind: "custom", min: 1, max: 3, greedy: true },
          },
        ],
        quantifier: { kind: "custom", min: 3, max: 3, greedy: true },
      },
      { id: "", type: "boundaryAssertion", kind: "end" },
    ],
    flags: [],
    withSlash: true,
  },
  "/^([1-9][0-9]*|0)(\\.[0-9]+)?$/": {
    type: "regex",
    body: [
      { id: "", type: "boundaryAssertion", kind: "beginning" },
      {
        id: "",
        type: "group",
        kind: "capturing",
        name: "1",
        index: 1,
        children: [
          {
            id: "",
            type: "choice",
            branches: [
              [
                {
                  id: "",
                  type: "character",
                  kind: "ranges",
                  ranges: [{ from: "1", to: "9" }],
                  negate: false,
                  quantifier: null,
                },
                {
                  id: "",
                  type: "character",
                  kind: "ranges",
                  ranges: [{ from: "0", to: "9" }],
                  negate: false,
                  quantifier: {
                    kind: "*",
                    min: 0,
                    max: Infinity,
                    greedy: true,
                  },
                },
              ],
              [
                {
                  id: "",
                  type: "character",
                  kind: "string",
                  value: "0",
                  quantifier: null,
                },
              ],
            ],
          },
        ],
        quantifier: null,
      },
      {
        id: "",
        type: "group",
        kind: "capturing",
        name: "2",
        index: 2,
        children: [
          {
            id: "",
            type: "character",
            kind: "string",
            value: ".",
            quantifier: null,
          },
          {
            id: "",
            type: "character",
            kind: "ranges",
            ranges: [{ from: "0", to: "9" }],
            negate: false,
            quantifier: { kind: "+", min: 1, max: Infinity, greedy: true },
          },
        ],
        quantifier: { kind: "?", min: 0, max: 1, greedy: true },
      },
      { id: "", type: "boundaryAssertion", kind: "end" },
    ],
    flags: [],
    withSlash: true,
  },
  "/^-?([1-9][0-9]*|0)(\\.[0-9]+)?$/": {
    type: "regex",
    body: [
      { id: "", type: "boundaryAssertion", kind: "beginning" },
      {
        id: "",
        type: "character",
        kind: "string",
        value: "-",
        quantifier: { kind: "?", min: 0, max: 1, greedy: true },
      },
      {
        id: "",
        type: "group",
        kind: "capturing",
        name: "1",
        index: 1,
        children: [
          {
            id: "",
            type: "choice",
            branches: [
              [
                {
                  id: "",
                  type: "character",
                  kind: "ranges",
                  ranges: [{ from: "1", to: "9" }],
                  negate: false,
                  quantifier: null,
                },
                {
                  id: "",
                  type: "character",
                  kind: "ranges",
                  ranges: [{ from: "0", to: "9" }],
                  negate: false,
                  quantifier: {
                    kind: "*",
                    min: 0,
                    max: Infinity,
                    greedy: true,
                  },
                },
              ],
              [
                {
                  id: "",
                  type: "character",
                  kind: "string",
                  value: "0",
                  quantifier: null,
                },
              ],
            ],
          },
        ],
        quantifier: null,
      },
      {
        id: "",
        type: "group",
        kind: "capturing",
        name: "2",
        index: 2,
        children: [
          {
            id: "",
            type: "character",
            kind: "string",
            value: ".",
            quantifier: null,
          },
          {
            id: "",
            type: "character",
            kind: "ranges",
            ranges: [{ from: "0", to: "9" }],
            negate: false,
            quantifier: { kind: "+", min: 1, max: Infinity, greedy: true },
          },
        ],
        quantifier: { kind: "?", min: 0, max: 1, greedy: true },
      },
      { id: "", type: "boundaryAssertion", kind: "end" },
    ],
    flags: [],
    withSlash: true,
  },
  "/^[ぁ-んー]*$/": {
    type: "regex",
    body: [
      { id: "", type: "boundaryAssertion", kind: "beginning" },
      {
        id: "",
        type: "character",
        kind: "ranges",
        ranges: [
          { from: "ぁ", to: "ん" },
          { from: "ー", to: "ー" },
        ],
        negate: false,
        quantifier: { kind: "*", min: 0, max: Infinity, greedy: true },
      },
      { id: "", type: "boundaryAssertion", kind: "end" },
    ],
    flags: [],
    withSlash: true,
  },
  "/^[ァ-ンヴー]*$/": {
    type: "regex",
    body: [
      { id: "", type: "boundaryAssertion", kind: "beginning" },
      {
        id: "",
        type: "character",
        kind: "ranges",
        ranges: [
          { from: "ァ", to: "ン" },
          { from: "ヴ", to: "ヴ" },
          { from: "ー", to: "ー" },
        ],
        negate: false,
        quantifier: { kind: "*", min: 0, max: Infinity, greedy: true },
      },
      { id: "", type: "boundaryAssertion", kind: "end" },
    ],
    flags: [],
    withSlash: true,
  },
  "/^[ｧ-ﾝﾞﾟ\\-]*$/": {
    type: "regex",
    body: [
      { id: "", type: "boundaryAssertion", kind: "beginning" },
      {
        id: "",
        type: "character",
        kind: "ranges",
        ranges: [
          { from: "ｧ", to: "ﾝ" },
          { from: "ﾞ", to: "ﾞ" },
          { from: "ﾟ", to: "ﾟ" },
          { from: "-", to: "-" },
        ],
        negate: false,
        quantifier: { kind: "*", min: 0, max: Infinity, greedy: true },
      },
      { id: "", type: "boundaryAssertion", kind: "end" },
    ],
    flags: [],
    withSlash: true,
  },
  "/^[^\\x20-\\x7e]*$/": {
    type: "regex",
    body: [
      { id: "", type: "boundaryAssertion", kind: "beginning" },
      {
        id: "",
        type: "character",
        kind: "ranges",
        ranges: [{ from: "\\x20", to: "\\x7e" }],
        negate: true,
        quantifier: { kind: "*", min: 0, max: Infinity, greedy: true },
      },
      { id: "", type: "boundaryAssertion", kind: "end" },
    ],
    flags: [],
    withSlash: true,
  },
  "/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\\.[a-zA-Z0-9-]+)*$/": {
    type: "regex",
    body: [
      { id: "", type: "boundaryAssertion", kind: "beginning" },
      {
        id: "",
        type: "character",
        kind: "ranges",
        ranges: [
          { from: "a", to: "z" },
          { from: "A", to: "Z" },
          { from: "0", to: "9" },
          { from: ".", to: "." },
          { from: "!", to: "!" },
          { from: "#", to: "#" },
          { from: "$", to: "$" },
          { from: "%", to: "%" },
          { from: "&", to: "&" },
          { from: "'", to: "'" },
          { from: "*", to: "*" },
          { from: "+", to: "+" },
          { from: "/", to: "/" },
          { from: "=", to: "=" },
          { from: "?", to: "?" },
          { from: "^", to: "^" },
          { from: "_", to: "_" },
          { from: "`", to: "`" },
          { from: "{", to: "{" },
          { from: "|", to: "|" },
          { from: "}", to: "}" },
          { from: "~", to: "~" },
          { from: "-", to: "-" },
        ],
        negate: false,
        quantifier: { kind: "+", min: 1, max: Infinity, greedy: true },
      },
      {
        id: "",
        type: "character",
        kind: "string",
        value: "@",
        quantifier: null,
      },
      {
        id: "",
        type: "character",
        kind: "ranges",
        ranges: [
          { from: "a", to: "z" },
          { from: "A", to: "Z" },
          { from: "0", to: "9" },
          { from: "-", to: "-" },
        ],
        negate: false,
        quantifier: { kind: "+", min: 1, max: Infinity, greedy: true },
      },
      {
        id: "",
        type: "group",
        kind: "nonCapturing",
        children: [
          {
            id: "",
            type: "character",
            kind: "string",
            value: ".",
            quantifier: null,
          },
          {
            id: "",
            type: "character",
            kind: "ranges",
            ranges: [
              { from: "a", to: "z" },
              { from: "A", to: "Z" },
              { from: "0", to: "9" },
              { from: "-", to: "-" },
            ],
            negate: false,
            quantifier: { kind: "+", min: 1, max: Infinity, greedy: true },
          },
        ],
        quantifier: { kind: "*", min: 0, max: Infinity, greedy: true },
      },
      { id: "", type: "boundaryAssertion", kind: "end" },
    ],
    flags: [],
    withSlash: true,
  },
  "/^((4\\d{3})|(5[1-5]\\d{2})|(6011))([- ])?\\d{4}([- ])?\\d{4}([- ])?\\d{4}|3[4,7]\\d{13}$/":
    {
      type: "regex",
      body: [
        {
          id: "",
          type: "choice",
          branches: [
            [
              { id: "", type: "boundaryAssertion", kind: "beginning" },
              {
                id: "",
                type: "group",
                kind: "capturing",
                name: "1",
                index: 1,
                children: [
                  {
                    id: "",
                    type: "choice",
                    branches: [
                      [
                        {
                          id: "",
                          type: "group",
                          kind: "capturing",
                          name: "2",
                          index: 2,
                          children: [
                            {
                              id: "",
                              type: "character",
                              kind: "string",
                              value: "4",
                              quantifier: null,
                            },
                            {
                              id: "",
                              type: "character",
                              kind: "class",
                              value: "\\d",
                              quantifier: {
                                kind: "custom",
                                min: 3,
                                max: 3,
                                greedy: true,
                              },
                            },
                          ],
                          quantifier: null,
                        },
                      ],
                      [
                        {
                          id: "",
                          type: "group",
                          kind: "capturing",
                          name: "3",
                          index: 3,
                          children: [
                            {
                              id: "",
                              type: "character",
                              kind: "string",
                              value: "5",
                              quantifier: null,
                            },
                            {
                              id: "",
                              type: "character",
                              kind: "ranges",
                              negate: false,
                              ranges: [{ from: "1", to: "5" }],
                              quantifier: null,
                            },
                            {
                              id: "",
                              type: "character",
                              kind: "class",
                              value: "\\d",
                              quantifier: {
                                kind: "custom",
                                min: 2,
                                max: 2,
                                greedy: true,
                              },
                            },
                          ],
                          quantifier: null,
                        },
                      ],
                      [
                        {
                          id: "",
                          type: "group",
                          kind: "capturing",
                          name: "4",
                          index: 4,
                          children: [
                            {
                              id: "",
                              type: "character",
                              kind: "string",
                              value: "6011",
                              quantifier: null,
                            },
                          ],
                          quantifier: null,
                        },
                      ],
                    ],
                  },
                ],
                quantifier: null,
              },
              {
                id: "",
                type: "group",
                kind: "capturing",
                name: "5",
                index: 5,
                children: [
                  {
                    id: "",
                    type: "character",
                    kind: "ranges",
                    negate: false,
                    ranges: [
                      { from: "-", to: "-" },
                      { from: " ", to: " " },
                    ],
                    quantifier: null,
                  },
                ],
                quantifier: { kind: "?", min: 0, max: 1, greedy: true },
              },
              {
                id: "",
                type: "character",
                kind: "class",
                value: "\\d",
                quantifier: { kind: "custom", min: 4, max: 4, greedy: true },
              },
              {
                id: "",
                type: "group",
                kind: "capturing",
                name: "6",
                index: 6,
                children: [
                  {
                    id: "",
                    type: "character",
                    kind: "ranges",
                    negate: false,
                    ranges: [
                      { from: "-", to: "-" },
                      { from: " ", to: " " },
                    ],
                    quantifier: null,
                  },
                ],
                quantifier: { kind: "?", min: 0, max: 1, greedy: true },
              },
              {
                id: "",
                type: "character",
                kind: "class",
                value: "\\d",
                quantifier: { kind: "custom", min: 4, max: 4, greedy: true },
              },
              {
                id: "",
                type: "group",
                kind: "capturing",
                name: "7",
                index: 7,
                children: [
                  {
                    id: "",
                    type: "character",
                    kind: "ranges",
                    negate: false,
                    ranges: [
                      { from: "-", to: "-" },
                      { from: " ", to: " " },
                    ],
                    quantifier: null,
                  },
                ],
                quantifier: { kind: "?", min: 0, max: 1, greedy: true },
              },
              {
                id: "",
                type: "character",
                kind: "class",
                value: "\\d",
                quantifier: { kind: "custom", min: 4, max: 4, greedy: true },
              },
            ],
            [
              {
                id: "",
                type: "character",
                kind: "string",
                value: "3",
                quantifier: null,
              },
              {
                id: "",
                type: "character",
                kind: "ranges",
                negate: false,
                ranges: [
                  { from: "4", to: "4" },
                  { from: ",", to: "," },
                  { from: "7", to: "7" },
                ],
                quantifier: null,
              },
              {
                id: "",
                type: "character",
                kind: "class",
                value: "\\d",
                quantifier: { kind: "custom", min: 13, max: 13, greedy: true },
              },
              { id: "", type: "boundaryAssertion", kind: "end" },
            ],
          ],
        },
      ],
      flags: [],
      withSlash: true,
    },
  "/^\\s*|\\s*$/": {
    type: "regex",
    body: [
      {
        id: "",
        type: "choice",
        branches: [
          [
            { id: "", type: "boundaryAssertion", kind: "beginning" },
            {
              id: "",
              type: "character",
              kind: "class",
              value: "\\s",
              quantifier: { kind: "*", min: 0, max: Infinity, greedy: true },
            },
          ],
          [
            {
              id: "",
              type: "character",
              kind: "class",
              value: "\\s",
              quantifier: { kind: "*", min: 0, max: Infinity, greedy: true },
            },
            { id: "", type: "boundaryAssertion", kind: "end" },
          ],
        ],
      },
    ],
    flags: [],
    withSlash: true,
  },
  "/(a)(?<n>b)(c)/": {
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
            type: "character",
            kind: "string",
            value: "a",
            quantifier: null,
          },
        ],
        quantifier: null,
      },
      {
        id: "",
        type: "group",
        kind: "namedCapturing",
        name: "n",
        index: 2,
        children: [
          {
            id: "",
            type: "character",
            kind: "string",
            value: "b",
            quantifier: null,
          },
        ],
        quantifier: null,
      },
      {
        id: "",
        type: "group",
        kind: "capturing",
        name: "3",
        index: 3,
        children: [
          {
            id: "",
            type: "character",
            kind: "string",
            value: "c",
            quantifier: null,
          },
        ],
        quantifier: null,
      },
    ],
    flags: [],
    withSlash: true,
  },
  "/x(?=y)/": {
    type: "regex",
    body: [
      {
        id: "",
        type: "character",
        kind: "string",
        value: "x",
        quantifier: null,
      },
      {
        id: "",
        type: "lookAroundAssertion",
        kind: "lookahead",
        children: [
          {
            id: "",
            type: "character",
            kind: "string",
            value: "y",
            quantifier: null,
          },
        ],
        negate: false,
      },
    ],
    flags: [],
    withSlash: true,
  },
  "/x?y/": {
    type: "regex",
    body: [
      {
        id: "",
        type: "character",
        kind: "string",
        value: "x",
        quantifier: { kind: "?", min: 0, max: 1, greedy: true },
      },
      {
        id: "",
        type: "character",
        kind: "string",
        value: "y",
        quantifier: null,
      },
    ],
    flags: [],
    withSlash: true,
  },
  "/\\k<Name>/": {
    type: "regex",
    body: [
      {
        id: "",
        type: "backReference",
        ref: "Name",
      },
    ],
    flags: [],
    withSlash: true,
  },
  "/a|b|c/": {
    type: "regex",
    body: [
      {
        id: "",
        type: "choice",
        branches: [
          [
            {
              id: "",
              type: "character",
              kind: "string",
              value: "a",
              quantifier: null,
            },
          ],
          [
            {
              id: "",
              type: "character",
              kind: "string",
              value: "b",
              quantifier: null,
            },
          ],
          [
            {
              id: "",
              type: "character",
              kind: "string",
              value: "c",
              quantifier: null,
            },
          ],
        ],
      },
    ],
    flags: [],
    withSlash: true,
  },
}

export default tests
