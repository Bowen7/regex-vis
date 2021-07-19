/* eslint-disable no-template-curly-in-string */
const tests = {
  "/(/": {
    type: "error",
    message: "Invalid regular expression: /(/: Unterminated group",
  },
  "/(?/": {
    type: "error",
    message: "Invalid regular expression: /(?/: Invalid group",
  },
  "/(?=/": {
    type: "error",
    message: "Invalid regular expression: /(?=/: Unterminated group",
  },
  "/(?=foo/": {
    type: "error",
    message: "Invalid regular expression: /(?=foo/: Unterminated group",
  },
  "/(?!/": {
    type: "error",
    message: "Invalid regular expression: /(?!/: Unterminated group",
  },
  "/(?!foo/": {
    type: "error",
    message: "Invalid regular expression: /(?!foo/: Unterminated group",
  },
  "/a{2,1}/": {
    type: "error",
    message:
      "Invalid regular expression: /a{2,1}/: numbers out of order in {} quantifier",
  },
  "/(a{2,1}/": {
    type: "error",
    message:
      "Invalid regular expression: /(a{2,1}/: numbers out of order in {} quantifier",
  },
  "/a{2,1}?/": {
    type: "error",
    message:
      "Invalid regular expression: /a{2,1}?/: numbers out of order in {} quantifier",
  },
  "/(*)/": {
    type: "error",
    message: "Invalid regular expression: /(*)/: Nothing to repeat",
  },
  "/+/": {
    type: "error",
    message: "Invalid regular expression: /+/: Nothing to repeat",
  },
  "/?/": {
    type: "error",
    message: "Invalid regular expression: /?/: Nothing to repeat",
  },
  "/)/": {
    type: "error",
    message: "Invalid regular expression: /)/: Unmatched ')'",
  },
  "/[/": {
    type: "error",
    message: "Invalid regular expression: /[/: Unterminated character class",
  },
  "/^*/": {
    type: "error",
    message: "Invalid regular expression: /^*/: Nothing to repeat",
  },
  "/$*/": {
    type: "error",
    message: "Invalid regular expression: /$*/: Nothing to repeat",
  },
  "/${1,2}/": {
    type: "error",
    message: "Invalid regular expression: /${1,2}/: Nothing to repeat",
  },
  "/${2,1}/": {
    type: "error",
    message: "Invalid regular expression: /${2,1}/: Nothing to repeat",
  },
  "/\\2(a)(/": {
    type: "error",
    message: "Invalid regular expression: /\\2(a)(/: Unterminated group",
  },
  "/(?a/": {
    type: "error",
    message: "Invalid regular expression: /(?a/: Invalid group",
  },
  "/(?a)/": {
    type: "error",
    message: "Invalid regular expression: /(?a)/: Invalid group",
  },
  "/(?:/": {
    type: "error",
    message: "Invalid regular expression: /(?:/: Unterminated group",
  },
  "/(?:a/": {
    type: "error",
    message: "Invalid regular expression: /(?:a/: Unterminated group",
  },
  "/(:a/": {
    type: "error",
    message: "Invalid regular expression: /(:a/: Unterminated group",
  },
  "/[b-a]/": {
    type: "error",
    message:
      "Invalid regular expression: /[b-a]/: Range out of order in character class",
  },
  "/[a-b--+]/": {
    type: "error",
    message:
      "Invalid regular expression: /[a-b--+]/: Range out of order in character class",
  },
  "/[\\u0001-\\u0000]/": {
    type: "error",
    message:
      "Invalid regular expression: /[\\u0001-\\u0000]/: Range out of order in character class",
  },
  "/[\\u{1}-\\u{2}]/": {
    type: "error",
    message:
      "Invalid regular expression: /[\\u{1}-\\u{2}]/: Range out of order in character class",
  },
  "/[\\u{2}-\\u{1}]/": {
    type: "error",
    message:
      "Invalid regular expression: /[\\u{2}-\\u{1}]/: Range out of order in character class",
  },
  "/[\\z-\\a]/": {
    type: "error",
    message:
      "Invalid regular expression: /[\\z-\\a]/: Range out of order in character class",
  },
  "/[0-9--+]/": {
    type: "error",
    message:
      "Invalid regular expression: /[0-9--+]/: Range out of order in character class",
  },
  "/[\\c-a]/": {
    type: "error",
    message:
      "Invalid regular expression: /[\\c-a]/: Range out of order in character class",
  },
  "/[🌷-🌸]/": {
    type: "error",
    message:
      "Invalid regular expression: /[🌷-🌸]/: Range out of order in character class",
  },
  "/[\\u0000-🌸-\\u0000]/": {
    type: "error",
    message:
      "Invalid regular expression: /[\\u0000-🌸-\\u0000]/: Range out of order in character class",
  },
  "/[\\u0000-\\ud83c\\udf38-\\u0000]/": {
    type: "error",
    message:
      "Invalid regular expression: /[\\u0000-\\ud83c\\udf38-\\u0000]/: Range out of order in character class",
  },
  "/[🌸-🌷]/": {
    type: "error",
    message:
      "Invalid regular expression: /[🌸-🌷]/: Range out of order in character class",
  },
  "/[\\uD834\\uDF06-\\uD834\\uDF08a-z]/": {
    type: "error",
    message:
      "Invalid regular expression: /[\\uD834\\uDF06-\\uD834\\uDF08a-z]/: Range out of order in character class",
  },
}
export default tests
