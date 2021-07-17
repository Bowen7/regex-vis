import * as AST from "../../ast"
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
  },
  "/||||/": {
    type: "regex",
    body: [{ id: "", type: "choice", branches: [[], [], [], [], []] }],
    flags: [],
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
  },
  "/^/": {
    type: "regex",
    body: [{ id: "", type: "boundaryAssertion", kind: "beginning" }],
    flags: [],
  },
  "/$/": {
    type: "regex",
    body: [{ id: "", type: "boundaryAssertion", kind: "end" }],
    flags: [],
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
  },
  "/|/": {
    type: "regex",
    body: [{ id: "", type: "choice", branches: [[], []] }],
    flags: [],
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
  },
  "/\\1/": {
    type: "regex",
    body: [
      {
        id: "",
        type: "backReference",
        name: "1",
      },
    ],
    flags: [],
  },
  "/(a)\\1/": {
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
        name: "1",
      },
    ],
    flags: [],
  },
  "/\\1(a)/": {
    type: "regex",
    body: [
      {
        id: "",
        type: "backReference",
        name: "1",
      },
      {
        id: "",
        type: "group",
        kind: "capturing",
        name: "1",
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
        name: "1",
      },
    ],
    flags: [],
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
  },
  "/\\cz/": {
    type: "regex",
    body: [
      {
        id: "",
        type: "character",
        kind: "string",
        value: "cz",
        quantifier: null,
      },
    ],
    flags: [],
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
  },
  "/\\377/": {
    type: "regex",
    body: [
      {
        id: "",
        type: "backReference",
        name: "377",
      },
    ],
    flags: [],
  },
  "/\\400/": {
    type: "regex",
    body: [
      {
        id: "",
        type: "backReference",
        name: "400",
      },
    ],
    flags: [],
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
  },
  // "/[\\d]/": { type: "regex", body: [], flags: [] },
  // "/[\\D]/": { type: "regex", body: [], flags: [] },
  // "/[\\s]/": { type: "regex", body: [], flags: [] },
  // "/[\\S]/": { type: "regex", body: [], flags: [] },
  // "/[\\w]/": { type: "regex", body: [], flags: [] },
  // "/[\\W]/": { type: "regex", body: [], flags: [] },
  // "/[\\f]/": { type: "regex", body: [], flags: [] },
  // "/[\\n]/": { type: "regex", body: [], flags: [] },
  // "/[\\r]/": { type: "regex", body: [], flags: [] },
  // "/[\\t]/": { type: "regex", body: [], flags: [] },
  // "/[\\v]/": { type: "regex", body: [], flags: [] },
  // "/[\\cA]/": { type: "regex", body: [], flags: [] },
  // "/[\\cz]/": { type: "regex", body: [], flags: [] },
  // "/[\\c1]/": { type: "regex", body: [], flags: [] },
  // "/[\\c]/": { type: "regex", body: [], flags: [] },
  // "/[\\0]/": { type: "regex", body: [], flags: [] },
  // "/[\\x]/": { type: "regex", body: [], flags: [] },
  // "/[\\xz]/": { type: "regex", body: [], flags: [] },
  // "/[\\x1]/": { type: "regex", body: [], flags: [] },
  // "/[\\x12]/": { type: "regex", body: [], flags: [] },
  // "/[\\x123]/": { type: "regex", body: [], flags: [] },
  // "/[\\u]/": { type: "regex", body: [], flags: [] },
  // "/[\\u1]/": { type: "regex", body: [], flags: [] },
  // "/[\\u12]/": { type: "regex", body: [], flags: [] },
  // "/[\\u123]/": { type: "regex", body: [], flags: [] },
  // "/[\\u1234]/": { type: "regex", body: [], flags: [] },
  // "/[\\u12345]/": { type: "regex", body: [], flags: [] },
  // "/[\\u{]/": { type: "regex", body: [], flags: [] },
  // "/[\\u{z]/": { type: "regex", body: [], flags: [] },
  // "/[\\u{a}]/": { type: "regex", body: [], flags: [] },
  // "/[\\u{20]/": { type: "regex", body: [], flags: [] },
  // "/[\\u{20}]/": { type: "regex", body: [], flags: [] },
  // "/[\\u{10FFFF}]/": { type: "regex", body: [], flags: [] },
  // "/[\\u{110000}]/": { type: "regex", body: [], flags: [] },
  // "/[\\u{00000001}]/": { type: "regex", body: [], flags: [] },
  // "/[\\77]/": { type: "regex", body: [], flags: [] },
  // "/[\\377]/": { type: "regex", body: [], flags: [] },
  // "/[\\400]/": { type: "regex", body: [], flags: [] },
  // "/[\\^]/": { type: "regex", body: [], flags: [] },
  // "/[\\$]/": { type: "regex", body: [], flags: [] },
  // "/[\\.]/": { type: "regex", body: [], flags: [] },
  // "/[\\+]/": { type: "regex", body: [], flags: [] },
  // "/[\\?]/": { type: "regex", body: [], flags: [] },
  // "/[\\(]/": { type: "regex", body: [], flags: [] },
  // "/[\\)]/": { type: "regex", body: [], flags: [] },
  // "/[\\[]/": { type: "regex", body: [], flags: [] },
  // "/[\\]]/": { type: "regex", body: [], flags: [] },
  // "/[\\{]/": { type: "regex", body: [], flags: [] },
  // "/[\\}]/": { type: "regex", body: [], flags: [] },
  // "/[\\|]/": { type: "regex", body: [], flags: [] },
  // "/[\\/]/": { type: "regex", body: [], flags: [] },
  // "/[\\a]/": { type: "regex", body: [], flags: [] },
  // "/[\\d-\\uFFFF]/": { type: "regex", body: [], flags: [] },
  // "/[\\D-\\uFFFF]/": { type: "regex", body: [], flags: [] },
  // "/[\\s-\\uFFFF]/": { type: "regex", body: [], flags: [] },
  // "/[\\S-\\uFFFF]/": { type: "regex", body: [], flags: [] },
  // "/[\\w-\\uFFFF]/": { type: "regex", body: [], flags: [] },
  // "/[\\W-\\uFFFF]/": { type: "regex", body: [], flags: [] },
  // "/[\\u0000-\\d]/": { type: "regex", body: [], flags: [] },
  // "/[\\u0000-\\D]/": { type: "regex", body: [], flags: [] },
  // "/[\\u0000-\\s]/": { type: "regex", body: [], flags: [] },
  // "/[\\u0000-\\S]/": { type: "regex", body: [], flags: [] },
  // "/[\\u0000-\\w]/": { type: "regex", body: [], flags: [] },
  // "/[\\u0000-\\W]/": { type: "regex", body: [], flags: [] },
  // "/[\\u0000-\\u0001]/": { type: "regex", body: [], flags: [] },
  // "/[\\u{2-\\u{1}]/": { type: "regex", body: [], flags: [] },
  // "/[\\a-\\z]/": { type: "regex", body: [], flags: [] },
  // "/[0-9--/]/": { type: "regex", body: [], flags: [] },
  // "/[\\c0-\u001f]/": { type: "regex", body: [], flags: [] },
  // "/[\\c_]/": { type: "regex", body: [], flags: [] },
  // "/^[0-9]*$/": { type: "regex", body: [], flags: [] },
  // "/^[0-9]+$/": { type: "regex", body: [], flags: [] },
  // "/^[a-zA-Z]*$/": { type: "regex", body: [], flags: [] },
  // "/^[a-zA-Z]+$/": { type: "regex", body: [], flags: [] },
  // "/^[0-9a-zA-Z]*$/": { type: "regex", body: [], flags: [] },
  // "/^[a-zA-Z0-9!-/:-@\\[-`{-~]*$/": { type: "regex", body: [], flags: [] },
  // "/^([a-zA-Z0-9]{8,})$/": { type: "regex", body: [], flags: [] },
  // "/^([a-zA-Z0-9]{6,8})$/": { type: "regex", body: [], flags: [] },
  // "/^([0-9]{0,8})$/": { type: "regex", body: [], flags: [] },
  // "/^[0-9]{8}$/": { type: "regex", body: [], flags: [] },
  // "/^https?:\\/\\//": { type: "regex", body: [], flags: [] },
  // "/^\\d{3}-\\d{4}$/": { type: "regex", body: [], flags: [] },
  // "/^\\d{1,3}(.\\d{1,3}){3}$/": { type: "regex", body: [], flags: [] },
  // "/^([1-9][0-9]*|0)(\\.[0-9]+)?$/": { type: "regex", body: [], flags: [] },
  // "/^-?([1-9][0-9]*|0)(\\.[0-9]+)?$/": { type: "regex", body: [], flags: [] },
  // "/^[ぁ-んー]*$/": { type: "regex", body: [], flags: [] },
  // "/^[ァ-ンヴー]*$/": { type: "regex", body: [], flags: [] },
  // "/^[ｧ-ﾝﾞﾟ\\-]*$/": { type: "regex", body: [], flags: [] },
  // "/^[^\\x20-\\x7e]*$/": { type: "regex", body: [], flags: [] },
  // "/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\\.[a-zA-Z0-9-]+)*$/": {
  //   type: "regex",
  //   body: [],
  //   flags: [],
  // },
  // "/^((4\\d{3})|(5[1-5]\\d{2})|(6011))([- ])?\\d{4}([- ])?\\d{4}([- ])?\\d{4}|3[4,7]\\d{13}$/":
  //   { type: "regex", body: [], flags: [] },
  // "/^\\s*|\\s*$/": { type: "regex", body: [], flags: [] },
  // "/[\\d][\\12-\\14]{1,}[^\\d]/": { type: "regex", body: [], flags: [] },
}

export default tests
