const tests = {
  "/(/u": {
    type: "error",
    message: "Invalid regular expression: /(/: Unterminated group",
  },
  "/(?/u": {
    type: "error",
    message: "Invalid regular expression: /(?/: Invalid group",
  },
  "/(?=/u": {
    type: "error",
    message: "Invalid regular expression: /(?=/: Unterminated group",
  },
  "/(?=foo/u": {
    type: "error",
    message: "Invalid regular expression: /(?=foo/: Unterminated group",
  },
  "/(?!/u": {
    type: "error",
    message: "Invalid regular expression: /(?!/: Unterminated group",
  },
  "/(?!foo/u": {
    type: "error",
    message: "Invalid regular expression: /(?!foo/: Unterminated group",
  },
  "/a{/u": {
    type: "error",
    message: "Invalid regular expression: /a{/: Incomplete quantifier",
  },
  "/a{}/u": {
    type: "error",
    message: "Invalid regular expression: /a{}/: Incomplete quantifier",
  },
  "/a{a}/u": {
    type: "error",
    message: "Invalid regular expression: /a{a}/: Incomplete quantifier",
  },
  "/a{1/u": {
    type: "error",
    message: "Invalid regular expression: /a{1/: Incomplete quantifier",
  },
  "/a{1,/u": {
    type: "error",
    message: "Invalid regular expression: /a{1,/: Incomplete quantifier",
  },
  "/a{1,2/u": {
    type: "error",
    message: "Invalid regular expression: /a{1,2/: Incomplete quantifier",
  },
  "/a{2,1}/u": {
    type: "error",
    message:
      "Invalid regular expression: /a{2,1}/: numbers out of order in {} quantifier",
  },
  "/a{2,1/u": {
    type: "error",
    message: "Invalid regular expression: /a{2,1/: Incomplete quantifier",
  },
  "/(a{2,1}/u": {
    type: "error",
    message:
      "Invalid regular expression: /(a{2,1}/: numbers out of order in {} quantifier",
  },
  "/a{?/u": {
    type: "error",
    message: "Invalid regular expression: /a{?/: Incomplete quantifier",
  },
  "/a{}?/u": {
    type: "error",
    message: "Invalid regular expression: /a{}?/: Incomplete quantifier",
  },
  "/a{a}?/u": {
    type: "error",
    message: "Invalid regular expression: /a{a}?/: Incomplete quantifier",
  },
  "/a{1?/u": {
    type: "error",
    message: "Invalid regular expression: /a{1?/: Incomplete quantifier",
  },
  "/a{1,?/u": {
    type: "error",
    message: "Invalid regular expression: /a{1,?/: Incomplete quantifier",
  },
  "/a{1,2?/u": {
    type: "error",
    message: "Invalid regular expression: /a{1,2?/: Incomplete quantifier",
  },
  "/a{2,1}?/u": {
    type: "error",
    message:
      "Invalid regular expression: /a{2,1}?/: numbers out of order in {} quantifier",
  },
  "/a{2,1?/u": {
    type: "error",
    message: "Invalid regular expression: /a{2,1?/: Incomplete quantifier",
  },
  "/(*)/u": {
    type: "error",
    message: "Invalid regular expression: /(*)/: Nothing to repeat",
  },
  "/+/u": {
    type: "error",
    message: "Invalid regular expression: /+/: Nothing to repeat",
  },
  "/?/u": {
    type: "error",
    message: "Invalid regular expression: /?/: Nothing to repeat",
  },
  "/)/u": {
    type: "error",
    message: "Invalid regular expression: /)/: Unmatched ')'",
  },
  "/[/u": {
    type: "error",
    message: "Invalid regular expression: /[/: Unterminated character class",
  },
  "/]/u": {
    type: "error",
    message: "Invalid regular expression: /]/: Lone quantifier brackets",
  },
  "/{/u": {
    type: "error",
    message: "Invalid regular expression: /{/: Lone quantifier brackets",
  },
  "/}/u": {
    type: "error",
    message: "Invalid regular expression: /}/: Lone quantifier brackets",
  },
  "/^*/u": {
    type: "error",
    message: "Invalid regular expression: /^*/: Nothing to repeat",
  },
  "/$*/u": {
    type: "error",
    message: "Invalid regular expression: /$*/: Nothing to repeat",
  },
  "/${1,2/u": {
    type: "error",
    message: "Invalid regular expression: /${1,2/: Lone quantifier brackets",
  },
  "/\\1/u": {
    type: "error",
    message: "Invalid regular expression: /\\1/: Invalid escape",
  },
  "/\\2(a)(/u": {
    type: "error",
    message: "Invalid regular expression: /\\2(a)(/: Unterminated group",
  },
  "/(?:a)\\1/u": {
    type: "error",
    message: "Invalid regular expression: /(?:a)\\1/: Invalid escape",
  },
  "/(a)\\2/u": {
    type: "error",
    message: "Invalid regular expression: /(a)\\2/: Invalid escape",
  },
  "/(?:a)\\2/u": {
    type: "error",
    message: "Invalid regular expression: /(?:a)\\2/: Invalid escape",
  },
  "/(a)(a)(a)(a)(a)(a)(a)(a)(a)(a)\\11/u": {
    type: "error",
    message:
      "Invalid regular expression: /(a)(a)(a)(a)(a)(a)(a)(a)(a)(a)\\11/: Invalid escape",
  },
  "/(?a/u": {
    type: "error",
    message: "Invalid regular expression: /(?a/: Invalid group",
  },
  "/(?a)/u": {
    type: "error",
    message: "Invalid regular expression: /(?a)/: Invalid group",
  },
  "/(?:/u": {
    type: "error",
    message: "Invalid regular expression: /(?:/: Unterminated group",
  },
  "/(?:a/u": {
    type: "error",
    message: "Invalid regular expression: /(?:a/: Unterminated group",
  },
  "/(:a/u": {
    type: "error",
    message: "Invalid regular expression: /(:a/: Unterminated group",
  },
  "/\\c1/u": {
    type: "error",
    message: "Invalid regular expression: /\\c1/: Invalid Unicode escape",
  },
  "/\\c/u": {
    type: "error",
    message: "Invalid regular expression: /\\c/: Invalid Unicode escape",
  },
  "/\\u/u": {
    type: "error",
    message: "Invalid regular expression: /\\u/: Invalid Unicode escape",
  },
  "/\\u1/u": {
    type: "error",
    message: "Invalid regular expression: /\\u1/: Invalid Unicode escape",
  },
  "/\\u12/u": {
    type: "error",
    message: "Invalid regular expression: /\\u12/: Invalid Unicode escape",
  },
  "/\\u123/u": {
    type: "error",
    message: "Invalid regular expression: /\\u123/: Invalid Unicode escape",
  },
  "/\\u{/u": {
    type: "error",
    message: "Invalid regular expression: /\\u{/: Invalid Unicode escape",
  },
  "/\\u{z/u": {
    type: "error",
    message: "Invalid regular expression: /\\u{z/: Invalid Unicode escape",
  },
  "/\\u{20/u": {
    type: "error",
    message: "Invalid regular expression: /\\u{20/: Invalid Unicode escape",
  },
  "/\\u{110000}/u": {
    type: "error",
    message:
      "Invalid regular expression: /\\u{110000}/: Invalid Unicode escape",
  },
  "/\\377/u": {
    type: "error",
    message: "Invalid regular expression: /\\377/: Invalid escape",
  },
  "/\\400/u": {
    type: "error",
    message: "Invalid regular expression: /\\400/: Invalid escape",
  },
  "/\\a/u": {
    type: "error",
    message: "Invalid regular expression: /\\a/: Invalid escape",
  },
  "/[b-a]/u": {
    type: "error",
    message:
      "Invalid regular expression: /[b-a]/: Range out of order in character class",
  },
  "/[a-b--+]/u": {
    type: "error",
    message:
      "Invalid regular expression: /[a-b--+]/: Range out of order in character class",
  },
  "/[\\c1]/u": {
    type: "error",
    message: "Invalid regular expression: /[\\c1]/: Invalid class escape",
  },
  "/[\\c]/u": {
    type: "error",
    message: "Invalid regular expression: /[\\c]/: Invalid class escape",
  },
  "/[\\x]/u": {
    type: "error",
    message: "Invalid regular expression: /[\\x]/: Invalid escape",
  },
  "/[\\xz]/u": {
    type: "error",
    message: "Invalid regular expression: /[\\xz]/: Invalid escape",
  },
  "/[\\x1]/u": {
    type: "error",
    message: "Invalid regular expression: /[\\x1]/: Invalid escape",
  },
  "/[\\u]/u": {
    type: "error",
    message: "Invalid regular expression: /[\\u]/: Invalid Unicode escape",
  },
  "/[\\u1]/u": {
    type: "error",
    message: "Invalid regular expression: /[\\u1]/: Invalid Unicode escape",
  },
  "/[\\u12]/u": {
    type: "error",
    message: "Invalid regular expression: /[\\u12]/: Invalid Unicode escape",
  },
  "/[\\u123]/u": {
    type: "error",
    message: "Invalid regular expression: /[\\u123]/: Invalid Unicode escape",
  },
  "/[\\u{]/u": {
    type: "error",
    message: "Invalid regular expression: /[\\u{]/: Invalid Unicode escape",
  },
  "/[\\u{z]/u": {
    type: "error",
    message: "Invalid regular expression: /[\\u{z]/: Invalid Unicode escape",
  },
  "/[\\u{20]/u": {
    type: "error",
    message: "Invalid regular expression: /[\\u{20]/: Invalid Unicode escape",
  },
  "/[\\u{110000}]/u": {
    type: "error",
    message:
      "Invalid regular expression: /[\\u{110000}]/: Invalid Unicode escape",
  },
  "/[\\77]/u": {
    type: "error",
    message: "Invalid regular expression: /[\\77]/: Invalid class escape",
  },
  "/[\\377]/u": {
    type: "error",
    message: "Invalid regular expression: /[\\377]/: Invalid class escape",
  },
  "/[\\400]/u": {
    type: "error",
    message: "Invalid regular expression: /[\\400]/: Invalid class escape",
  },
  "/[\\a]/u": {
    type: "error",
    message: "Invalid regular expression: /[\\a]/: Invalid escape",
  },
  "/[\\d-\\uFFFF]/u": {
    type: "error",
    message:
      "Invalid regular expression: /[\\d-\\uFFFF]/: Invalid character class",
  },
  "/[\\D-\\uFFFF]/u": {
    type: "error",
    message:
      "Invalid regular expression: /[\\D-\\uFFFF]/: Invalid character class",
  },
  "/[\\s-\\uFFFF]/u": {
    type: "error",
    message:
      "Invalid regular expression: /[\\s-\\uFFFF]/: Invalid character class",
  },
  "/[\\S-\\uFFFF]/u": {
    type: "error",
    message:
      "Invalid regular expression: /[\\S-\\uFFFF]/: Invalid character class",
  },
  "/[\\w-\\uFFFF]/u": {
    type: "error",
    message:
      "Invalid regular expression: /[\\w-\\uFFFF]/: Invalid character class",
  },
  "/[\\W-\\uFFFF]/u": {
    type: "error",
    message:
      "Invalid regular expression: /[\\W-\\uFFFF]/: Invalid character class",
  },
  "/[\\u0000-\\d]/u": {
    type: "error",
    message:
      "Invalid regular expression: /[\\u0000-\\d]/: Invalid character class",
  },
  "/[\\u0000-\\D]/u": {
    type: "error",
    message:
      "Invalid regular expression: /[\\u0000-\\D]/: Invalid character class",
  },
  "/[\\u0000-\\s]/u": {
    type: "error",
    message:
      "Invalid regular expression: /[\\u0000-\\s]/: Invalid character class",
  },
  "/[\\u0000-\\S]/u": {
    type: "error",
    message:
      "Invalid regular expression: /[\\u0000-\\S]/: Invalid character class",
  },
  "/[\\u0000-\\w]/u": {
    type: "error",
    message:
      "Invalid regular expression: /[\\u0000-\\w]/: Invalid character class",
  },
  "/[\\u0000-\\W]/u": {
    type: "error",
    message:
      "Invalid regular expression: /[\\u0000-\\W]/: Invalid character class",
  },
  "/[\\u0001-\\u0000]/u": {
    type: "error",
    message:
      "Invalid regular expression: /[\\u0001-\\u0000]/: Range out of order in character class",
  },
  "/[\\u{2}-\\u{1}]/u": {
    type: "error",
    message:
      "Invalid regular expression: /[\\u{2}-\\u{1}]/: Range out of order in character class",
  },
  "/[\\u{2-\\u{1}]/u": {
    type: "error",
    message:
      "Invalid regular expression: /[\\u{2-\\u{1}]/: Invalid Unicode escape",
  },
  "/[\\a-\\z]/u": {
    type: "error",
    message: "Invalid regular expression: /[\\a-\\z]/: Invalid escape",
  },
  "/[\\z-\\a]/u": {
    type: "error",
    message: "Invalid regular expression: /[\\z-\\a]/: Invalid escape",
  },
  "/[0-9--+]/u": {
    type: "error",
    message:
      "Invalid regular expression: /[0-9--+]/: Range out of order in character class",
  },
  "/[\\c-a]/u": {
    type: "error",
    message: "Invalid regular expression: /[\\c-a]/: Invalid class escape",
  },
  "/[\\c0-\u001f]/u": {
    type: "error",
    message:
      "Invalid regular expression: /[\\c0-\u001f]/: Invalid class escape",
  },
  "/[\\c_]/u": {
    type: "error",
    message: "Invalid regular expression: /[\\c_]/: Invalid class escape",
  },
  "/[🌸-🌷]/u": {
    type: "error",
    message:
      "Invalid regular expression: /[🌸-🌷]/: Range out of order in character class",
  },
  "/[\\d][\\12-\\14]{1,}[^\\d]/u": {
    type: "error",
    message:
      "Invalid regular expression: /[\\d][\\12-\\14]{1,}[^\\d]/: Invalid class escape",
  },
}

export default tests
