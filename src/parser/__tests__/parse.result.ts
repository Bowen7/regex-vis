const result = {
  "/a/": [
    { type: "root" },
    {
      type: "character",
      value: { kind: "string", value: "a" },
    },
    { type: "root" },
  ],
  "/abc/": [
    { type: "root" },
    {
      type: "character",
      value: { kind: "string", value: "abc" },
    },
    { type: "root" },
  ],
  "/[a-b]/": [
    { type: "root" },
    {
      type: "character",
      value: {
        kind: "ranges",
        value: [{ from: "a", to: "b" }],
        negate: false,
      },
    },
    { type: "root" },
  ],
  "/[a]/": [
    { type: "root" },
    {
      type: "character",
      value: {
        kind: "ranges",
        value: [{ from: "a", to: "a" }],
        negate: false,
      },
    },
    { type: "root" },
  ],
  "/[a-bb-c]/": [
    { type: "root" },
    {
      type: "character",
      value: {
        kind: "ranges",
        value: [
          { from: "a", to: "b" },
          { from: "b", to: "c" },
        ],
        negate: false,
      },
    },
    { type: "root" },
  ],
  "/[a-bc]/": [
    { type: "root" },
    {
      type: "character",
      value: {
        kind: "ranges",
        value: [
          { from: "a", to: "b" },
          { from: "c", to: "c" },
        ],
        negate: false,
      },
    },
    { type: "root" },
  ],
  "/[^a-bc]/": [
    { type: "root" },
    {
      type: "character",
      value: {
        kind: "ranges",
        value: [
          { from: "a", to: "b" },
          { from: "c", to: "c" },
        ],
        negate: true,
      },
    },
    { type: "root" },
  ],
  "/[-b]/": [
    { type: "root" },
    {
      type: "character",
      value: {
        kind: "ranges",
        value: [
          { from: "-", to: "-" },
          { from: "b", to: "b" },
        ],
        negate: false,
      },
    },
    { type: "root" },
  ],
  "/[b-]/": [
    { type: "root" },
    {
      type: "character",
      value: {
        kind: "ranges",
        value: [
          { from: "b", to: "b" },
          { from: "-", to: "-" },
        ],
        negate: false,
      },
    },
    { type: "root" },
  ],
  "/^a/": [
    { type: "root" },
    {
      type: "boundaryAssertion",
      value: {
        kind: "start",
      },
    },
    {
      type: "character",
      value: { kind: "string", value: "a" },
    },
    { type: "root" },
  ],
  "/a$/": [
    { type: "root" },
    {
      type: "character",
      value: { kind: "string", value: "a" },
    },
    {
      type: "boundaryAssertion",
      value: {
        kind: "end",
      },
    },
    { type: "root" },
  ],
  "/a\\b/": [
    { type: "root" },
    {
      type: "character",
      value: { kind: "string", value: "a" },
    },
    {
      type: "boundaryAssertion",
      value: {
        kind: "word",
        negate: false,
      },
    },
    { type: "root" },
  ],
  "/a\\B/": [
    { type: "root" },
    {
      type: "character",
      value: { kind: "string", value: "a" },
    },
    {
      type: "boundaryAssertion",
      value: {
        kind: "word",
        negate: true,
      },
    },
    { type: "root" },
  ],
  "/x(?=y)/": [
    { type: "root" },
    {
      type: "character",
      value: { kind: "string", value: "x" },
    },
    {
      type: "lookaroundAssertion",
      value: {
        kind: "lookahead",
        negate: false,
      },
      children: [
        {
          type: "character",
          value: { kind: "string", value: "y" },
        },
      ],
    },
    { type: "root" },
  ],
  "/x(?!y)/": [
    { type: "root" },
    {
      type: "character",
      value: { kind: "string", value: "x" },
    },
    {
      type: "lookaroundAssertion",
      value: {
        kind: "lookahead",
        negate: true,
      },
      children: [
        {
          type: "character",
          value: { kind: "string", value: "y" },
        },
      ],
    },
    { type: "root" },
  ],
  "/(?<=y)x/": [
    { type: "root" },
    {
      type: "lookaroundAssertion",
      value: {
        kind: "lookbehind",
        negate: false,
      },
      children: [
        {
          type: "character",
          value: { kind: "string", value: "y" },
        },
      ],
    },
    {
      type: "character",
      value: { kind: "string", value: "x" },
    },
    { type: "root" },
  ],
  "/(?<!y)x/": [
    { type: "root" },
    {
      type: "lookaroundAssertion",
      value: {
        kind: "lookbehind",
        negate: true,
      },
      children: [
        {
          type: "character",
          value: { kind: "string", value: "y" },
        },
      ],
    },
    {
      type: "character",
      value: { kind: "string", value: "x" },
    },
    { type: "root" },
  ],
  "/a|b/": [
    { type: "root" },
    {
      type: "choice",
      branches: [
        [
          {
            type: "character",
            value: { kind: "string", value: "a" },
          },
        ],
        [
          {
            type: "character",
            value: { kind: "string", value: "b" },
          },
        ],
      ],
    },
    { type: "root" },
  ],
  "/(a)/": [
    { type: "root" },
    {
      type: "group",
      value: {
        kind: "capturing",
        name: "1",
      },
      children: [
        {
          type: "character",
          value: { kind: "string", value: "a" },
        },
      ],
    },
    { type: "root" },
  ],
  "/(?<b>a)/": [
    { type: "root" },
    {
      type: "group",
      value: {
        kind: "namedCapturing",
        name: "b",
      },
      children: [
        {
          type: "character",
          value: { kind: "string", value: "a" },
        },
      ],
    },
    { type: "root" },
  ],
  "/(?:a)/": [
    { type: "root" },
    {
      type: "group",
      value: {
        kind: "nonCapturing",
      },
      children: [
        {
          type: "character",
          value: { kind: "string", value: "a" },
        },
      ],
    },
    { type: "root" },
  ],
  "/a*/": [
    { type: "root" },
    {
      type: "character",
      value: { kind: "string", value: "a" },
      quantifier: { kind: "*", min: 0, max: Infinity, greedy: true },
    },
    { type: "root" },
  ],
  "/a+/": [
    { type: "root" },
    {
      type: "character",
      value: { kind: "string", value: "a" },
      quantifier: { kind: "+", min: 1, max: Infinity, greedy: true },
    },
    { type: "root" },
  ],
  "/a?/": [
    { type: "root" },
    {
      type: "character",
      value: { kind: "string", value: "a" },
      quantifier: { kind: "?", min: 0, max: 1, greedy: true },
    },
    { type: "root" },
  ],
  "/a{2}/": [
    { type: "root" },
    {
      type: "character",
      value: { kind: "string", value: "a" },
      quantifier: { kind: "custom", min: 2, max: 2, greedy: true },
    },
    { type: "root" },
  ],
  "/a{2,}/": [
    { type: "root" },
    {
      type: "character",
      value: { kind: "string", value: "a" },
      quantifier: { kind: "custom", min: 2, max: Infinity, greedy: true },
    },
    { type: "root" },
  ],
  "/a{2,4}/": [
    { type: "root" },
    {
      type: "character",
      value: { kind: "string", value: "a" },
      quantifier: { kind: "custom", min: 2, max: 4, greedy: true },
    },
    { type: "root" },
  ],
  "/a*?/": [
    { type: "root" },
    {
      type: "character",
      value: { kind: "string", value: "a" },
      quantifier: { kind: "*", min: 0, max: Infinity, greedy: false },
    },
    { type: "root" },
  ],
  "/./": [
    { type: "root" },
    {
      type: "character",
      value: { kind: "class", value: "." },
    },
    { type: "root" },
  ],
}
export default result
