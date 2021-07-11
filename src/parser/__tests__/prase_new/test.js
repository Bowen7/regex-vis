const tests = {
  "/(/u": {
    error: {
      message: "Invalid regular expression: /(/u: Unterminated group",
      index: 2,
    },
  },
  "/(?/u": {
    error: {
      message: "Invalid regular expression: /(?/u: Invalid group",
      index: 2,
    },
  },
  "/(?=/u": {
    error: {
      message: "Invalid regular expression: /(?=/u: Unterminated group",
      index: 4,
    },
  },
  "/(?=foo/u": {
    error: {
      message: "Invalid regular expression: /(?=foo/u: Unterminated group",
      index: 7,
    },
  },
  "/(?!/u": {
    error: {
      message: "Invalid regular expression: /(?!/u: Unterminated group",
      index: 4,
    },
  },
  "/(?!foo/u": {
    error: {
      message: "Invalid regular expression: /(?!foo/u: Unterminated group",
      index: 7,
    },
  },
  "/(?=a)*/u": {
    error: {
      message: "Invalid regular expression: /(?=a)*/u: Nothing to repeat",
      index: 7,
    },
  },
  "/(?=a)+/u": {
    error: {
      message: "Invalid regular expression: /(?=a)+/u: Nothing to repeat",
      index: 7,
    },
  },
  "/(?=a)?/u": {
    error: {
      message: "Invalid regular expression: /(?=a)?/u: Nothing to repeat",
      index: 7,
    },
  },
  "/(?=a){/u": {
    error: {
      message:
        "Invalid regular expression: /(?=a){/u: Lone quantifier brackets",
      index: 7,
    },
  },
  "/(?=a){}/u": {
    error: {
      message:
        "Invalid regular expression: /(?=a){}/u: Lone quantifier brackets",
      index: 7,
    },
  },
  "/(?=a){a}/u": {
    error: {
      message:
        "Invalid regular expression: /(?=a){a}/u: Lone quantifier brackets",
      index: 7,
    },
  },
  "/(?=a){1}/u": {
    error: {
      message: "Invalid regular expression: /(?=a){1}/u: Nothing to repeat",
      index: 9,
    },
  },
  "/(?=a){1,}/u": {
    error: {
      message: "Invalid regular expression: /(?=a){1,}/u: Nothing to repeat",
      index: 10,
    },
  },
  "/(?=a){1,2}/u": {
    error: {
      message: "Invalid regular expression: /(?=a){1,2}/u: Nothing to repeat",
      index: 11,
    },
  },
  "/a{/u": {
    error: {
      message: "Invalid regular expression: /a{/u: Incomplete quantifier",
      index: 3,
    },
  },
  "/a{}/u": {
    error: {
      message: "Invalid regular expression: /a{}/u: Incomplete quantifier",
      index: 3,
    },
  },
  "/a{a}/u": {
    error: {
      message: "Invalid regular expression: /a{a}/u: Incomplete quantifier",
      index: 3,
    },
  },
  "/a{1/u": {
    error: {
      message: "Invalid regular expression: /a{1/u: Incomplete quantifier",
      index: 4,
    },
  },
  "/a{1,/u": {
    error: {
      message: "Invalid regular expression: /a{1,/u: Incomplete quantifier",
      index: 5,
    },
  },
  "/a{1,2/u": {
    error: {
      message: "Invalid regular expression: /a{1,2/u: Incomplete quantifier",
      index: 6,
    },
  },
  "/a{2,1}/u": {
    error: {
      message:
        "Invalid regular expression: /a{2,1}/u: numbers out of order in {} quantifier",
      index: 7,
    },
  },
  "/a{2,1/u": {
    error: {
      message: "Invalid regular expression: /a{2,1/u: Incomplete quantifier",
      index: 6,
    },
  },
  "/(a{2,1}/u": {
    error: {
      message:
        "Invalid regular expression: /(a{2,1}/u: numbers out of order in {} quantifier",
      index: 8,
    },
  },
  "/a{?/u": {
    error: {
      message: "Invalid regular expression: /a{?/u: Incomplete quantifier",
      index: 3,
    },
  },
  "/a{}?/u": {
    error: {
      message: "Invalid regular expression: /a{}?/u: Incomplete quantifier",
      index: 3,
    },
  },
  "/a{a}?/u": {
    error: {
      message: "Invalid regular expression: /a{a}?/u: Incomplete quantifier",
      index: 3,
    },
  },
  "/a{1?/u": {
    error: {
      message: "Invalid regular expression: /a{1?/u: Incomplete quantifier",
      index: 4,
    },
  },
  "/a{1,?/u": {
    error: {
      message: "Invalid regular expression: /a{1,?/u: Incomplete quantifier",
      index: 5,
    },
  },
  "/a{1,2?/u": {
    error: {
      message: "Invalid regular expression: /a{1,2?/u: Incomplete quantifier",
      index: 6,
    },
  },
  "/a{2,1}?/u": {
    error: {
      message:
        "Invalid regular expression: /a{2,1}?/u: numbers out of order in {} quantifier",
      index: 7,
    },
  },
  "/a{2,1?/u": {
    error: {
      message: "Invalid regular expression: /a{2,1?/u: Incomplete quantifier",
      index: 6,
    },
  },
  "/(*)/u": {
    error: {
      message: "Invalid regular expression: /(*)/u: Nothing to repeat",
      index: 3,
    },
  },
  "/+/u": {
    error: {
      message: "Invalid regular expression: /+/u: Nothing to repeat",
      index: 2,
    },
  },
  "/?/u": {
    error: {
      message: "Invalid regular expression: /?/u: Nothing to repeat",
      index: 2,
    },
  },
  "/)/u": {
    error: {
      message: "Invalid regular expression: /)/u: Unmatched ')'",
      index: 1,
    },
  },
  "/[/u": {
    error: {
      message: "Invalid regular expression: /[/u: Unterminated character class",
      index: 4,
    },
  },
  "/]/u": {
    error: {
      message: "Invalid regular expression: /]/u: Lone quantifier brackets",
      index: 1,
    },
  },
  "/{/u": {
    error: {
      message: "Invalid regular expression: /{/u: Lone quantifier brackets",
      index: 2,
    },
  },
  "/}/u": {
    error: {
      message: "Invalid regular expression: /}/u: Lone quantifier brackets",
      index: 1,
    },
  },
  "/^*/u": {
    error: {
      message: "Invalid regular expression: /^*/u: Nothing to repeat",
      index: 3,
    },
  },
  "/$*/u": {
    error: {
      message: "Invalid regular expression: /$*/u: Nothing to repeat",
      index: 3,
    },
  },
  "/${1,2/u": {
    error: {
      message: "Invalid regular expression: /${1,2/u: Lone quantifier brackets",
      index: 3,
    },
  },
  "/${1,2}/u": {
    error: {
      message: "Invalid regular expression: /${1,2}/u: Nothing to repeat",
      index: 7,
    },
  },
  "/${2,1}/u": {
    error: {
      message: "Invalid regular expression: /${2,1}/u: Nothing to repeat",
      index: 7,
    },
  },
  "/\\1/u": {
    error: {
      message: "Invalid regular expression: /\\1/u: Invalid escape",
      index: 3,
    },
  },
  "/\\2(a)(/u": {
    error: {
      message: "Invalid regular expression: /\\2(a)(/u: Unterminated group",
      index: 7,
    },
  },
  "/(?:a)\\1/u": {
    error: {
      message: "Invalid regular expression: /(?:a)\\1/u: Invalid escape",
      index: 8,
    },
  },
  "/(a)\\2/u": {
    error: {
      message: "Invalid regular expression: /(a)\\2/u: Invalid escape",
      index: 6,
    },
  },
  "/(?:a)\\2/u": {
    error: {
      message: "Invalid regular expression: /(?:a)\\2/u: Invalid escape",
      index: 8,
    },
  },
  "/(a)(a)(a)(a)(a)(a)(a)(a)(a)(a)\\11/u": {
    error: {
      message:
        "Invalid regular expression: /(a)(a)(a)(a)(a)(a)(a)(a)(a)(a)\\11/u: Invalid escape",
      index: 34,
    },
  },
  "/(?a/u": {
    error: {
      message: "Invalid regular expression: /(?a/u: Invalid group",
      index: 2,
    },
  },
  "/(?a)/u": {
    error: {
      message: "Invalid regular expression: /(?a)/u: Invalid group",
      index: 2,
    },
  },
  "/(?:/u": {
    error: {
      message: "Invalid regular expression: /(?:/u: Unterminated group",
      index: 4,
    },
  },
  "/(?:a/u": {
    error: {
      message: "Invalid regular expression: /(?:a/u: Unterminated group",
      index: 5,
    },
  },
  "/(:a/u": {
    error: {
      message: "Invalid regular expression: /(:a/u: Unterminated group",
      index: 4,
    },
  },
  "/\\c1/u": {
    error: {
      message: "Invalid regular expression: /\\c1/u: Invalid escape",
      index: 2,
    },
  },
  "/\\c/u": {
    error: {
      message: "Invalid regular expression: /\\c/u: Invalid escape",
      index: 2,
    },
  },
  "/\\u/u": {
    error: {
      message: "Invalid regular expression: /\\u/u: Invalid unicode escape",
      index: 3,
    },
  },
  "/\\u1/u": {
    error: {
      message: "Invalid regular expression: /\\u1/u: Invalid unicode escape",
      index: 3,
    },
  },
  "/\\u12/u": {
    error: {
      message: "Invalid regular expression: /\\u12/u: Invalid unicode escape",
      index: 3,
    },
  },
  "/\\u123/u": {
    error: {
      message: "Invalid regular expression: /\\u123/u: Invalid unicode escape",
      index: 3,
    },
  },
  "/\\u{/u": {
    error: {
      message: "Invalid regular expression: /\\u{/u: Invalid unicode escape",
      index: 3,
    },
  },
  "/\\u{z/u": {
    error: {
      message: "Invalid regular expression: /\\u{z/u: Invalid unicode escape",
      index: 3,
    },
  },
  "/\\u{20/u": {
    error: {
      message: "Invalid regular expression: /\\u{20/u: Invalid unicode escape",
      index: 3,
    },
  },
  "/\\u{110000}/u": {
    error: {
      message:
        "Invalid regular expression: /\\u{110000}/u: Invalid unicode escape",
      index: 3,
    },
  },
  "/\\377/u": {
    error: {
      message: "Invalid regular expression: /\\377/u: Invalid escape",
      index: 5,
    },
  },
  "/\\400/u": {
    error: {
      message: "Invalid regular expression: /\\400/u: Invalid escape",
      index: 5,
    },
  },
  "/\\a/u": {
    error: {
      message: "Invalid regular expression: /\\a/u: Invalid escape",
      index: 2,
    },
  },
  "/[b-a]/u": {
    error: {
      message:
        "Invalid regular expression: /[b-a]/u: Range out of order in character class",
      index: 5,
    },
  },
  "/[a-b--+]/u": {
    error: {
      message:
        "Invalid regular expression: /[a-b--+]/u: Range out of order in character class",
      index: 8,
    },
  },
  "/[\\c1]/u": {
    error: {
      message: "Invalid regular expression: /[\\c1]/u: Invalid escape",
      index: 3,
    },
  },
  "/[\\c]/u": {
    error: {
      message: "Invalid regular expression: /[\\c]/u: Invalid escape",
      index: 3,
    },
  },
  "/[\\x]/u": {
    error: {
      message: "Invalid regular expression: /[\\x]/u: Invalid escape",
      index: 4,
    },
  },
  "/[\\xz]/u": {
    error: {
      message: "Invalid regular expression: /[\\xz]/u: Invalid escape",
      index: 4,
    },
  },
  "/[\\x1]/u": {
    error: {
      message: "Invalid regular expression: /[\\x1]/u: Invalid escape",
      index: 4,
    },
  },
  "/[\\u]/u": {
    error: {
      message: "Invalid regular expression: /[\\u]/u: Invalid unicode escape",
      index: 4,
    },
  },
  "/[\\u1]/u": {
    error: {
      message: "Invalid regular expression: /[\\u1]/u: Invalid unicode escape",
      index: 4,
    },
  },
  "/[\\u12]/u": {
    error: {
      message: "Invalid regular expression: /[\\u12]/u: Invalid unicode escape",
      index: 4,
    },
  },
  "/[\\u123]/u": {
    error: {
      message:
        "Invalid regular expression: /[\\u123]/u: Invalid unicode escape",
      index: 4,
    },
  },
  "/[\\u{]/u": {
    error: {
      message: "Invalid regular expression: /[\\u{]/u: Invalid unicode escape",
      index: 4,
    },
  },
  "/[\\u{z]/u": {
    error: {
      message: "Invalid regular expression: /[\\u{z]/u: Invalid unicode escape",
      index: 4,
    },
  },
  "/[\\u{20]/u": {
    error: {
      message:
        "Invalid regular expression: /[\\u{20]/u: Invalid unicode escape",
      index: 4,
    },
  },
  "/[\\u{110000}]/u": {
    error: {
      message:
        "Invalid regular expression: /[\\u{110000}]/u: Invalid unicode escape",
      index: 4,
    },
  },
  "/[\\77]/u": {
    error: {
      message: "Invalid regular expression: /[\\77]/u: Invalid escape",
      index: 3,
    },
  },
  "/[\\377]/u": {
    error: {
      message: "Invalid regular expression: /[\\377]/u: Invalid escape",
      index: 3,
    },
  },
  "/[\\400]/u": {
    error: {
      message: "Invalid regular expression: /[\\400]/u: Invalid escape",
      index: 3,
    },
  },
  "/[\\a]/u": {
    error: {
      message: "Invalid regular expression: /[\\a]/u: Invalid escape",
      index: 3,
    },
  },
  "/[\\d-\\uFFFF]/u": {
    error: {
      message:
        "Invalid regular expression: /[\\d-\\uFFFF]/u: Invalid character class",
      index: 11,
    },
  },
  "/[\\D-\\uFFFF]/u": {
    error: {
      message:
        "Invalid regular expression: /[\\D-\\uFFFF]/u: Invalid character class",
      index: 11,
    },
  },
  "/[\\s-\\uFFFF]/u": {
    error: {
      message:
        "Invalid regular expression: /[\\s-\\uFFFF]/u: Invalid character class",
      index: 11,
    },
  },
  "/[\\S-\\uFFFF]/u": {
    error: {
      message:
        "Invalid regular expression: /[\\S-\\uFFFF]/u: Invalid character class",
      index: 11,
    },
  },
  "/[\\w-\\uFFFF]/u": {
    error: {
      message:
        "Invalid regular expression: /[\\w-\\uFFFF]/u: Invalid character class",
      index: 11,
    },
  },
  "/[\\W-\\uFFFF]/u": {
    error: {
      message:
        "Invalid regular expression: /[\\W-\\uFFFF]/u: Invalid character class",
      index: 11,
    },
  },
  "/[\\u0000-\\d]/u": {
    error: {
      message:
        "Invalid regular expression: /[\\u0000-\\d]/u: Invalid character class",
      index: 11,
    },
  },
  "/[\\u0000-\\D]/u": {
    error: {
      message:
        "Invalid regular expression: /[\\u0000-\\D]/u: Invalid character class",
      index: 11,
    },
  },
  "/[\\u0000-\\s]/u": {
    error: {
      message:
        "Invalid regular expression: /[\\u0000-\\s]/u: Invalid character class",
      index: 11,
    },
  },
  "/[\\u0000-\\S]/u": {
    error: {
      message:
        "Invalid regular expression: /[\\u0000-\\S]/u: Invalid character class",
      index: 11,
    },
  },
  "/[\\u0000-\\w]/u": {
    error: {
      message:
        "Invalid regular expression: /[\\u0000-\\w]/u: Invalid character class",
      index: 11,
    },
  },
  "/[\\u0000-\\W]/u": {
    error: {
      message:
        "Invalid regular expression: /[\\u0000-\\W]/u: Invalid character class",
      index: 11,
    },
  },
  "/[\\u0001-\\u0000]/u": {
    error: {
      message:
        "Invalid regular expression: /[\\u0001-\\u0000]/u: Range out of order in character class",
      index: 15,
    },
  },
  "/[\\u{2}-\\u{1}]/u": {
    error: {
      message:
        "Invalid regular expression: /[\\u{2}-\\u{1}]/u: Range out of order in character class",
      index: 13,
    },
  },
  "/[\\u{2-\\u{1}]/u": {
    error: {
      message:
        "Invalid regular expression: /[\\u{2-\\u{1}]/u: Invalid unicode escape",
      index: 4,
    },
  },
  "/[\\a-\\z]/u": {
    error: {
      message: "Invalid regular expression: /[\\a-\\z]/u: Invalid escape",
      index: 3,
    },
  },
  "/[\\z-\\a]/u": {
    error: {
      message: "Invalid regular expression: /[\\z-\\a]/u: Invalid escape",
      index: 3,
    },
  },
  "/[0-9--+]/u": {
    error: {
      message:
        "Invalid regular expression: /[0-9--+]/u: Range out of order in character class",
      index: 8,
    },
  },
  "/[\\c-a]/u": {
    error: {
      message: "Invalid regular expression: /[\\c-a]/u: Invalid escape",
      index: 3,
    },
  },
  "/[\\c0-\u001f]/u": {
    error: {
      message: "Invalid regular expression: /[\\c0-\u001f]/u: Invalid escape",
      index: 3,
    },
  },
  "/[\\c_]/u": {
    error: {
      message: "Invalid regular expression: /[\\c_]/u: Invalid escape",
      index: 3,
    },
  },
  "/[🌸-🌷]/u": {
    error: {
      message:
        "Invalid regular expression: /[🌸-🌷]/u: Range out of order in character class",
      index: 7,
    },
  },
  "/[\\d][\\12-\\14]{1,}[^\\d]/u": {
    error: {
      message:
        "Invalid regular expression: /[\\d][\\12-\\14]{1,}[^\\d]/u: Invalid escape",
      index: 7,
    },
  },
}

Object.entries(tests).forEach(([key, value]) => {
  tests[key] = { type: "error", message: value.error.message }
})
console.log(JSON.stringify(tests))
