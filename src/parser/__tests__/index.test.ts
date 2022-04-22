import parse from "../parse"
import gen from "../gen"
import invalid2015Tests from "./invalid-2015"
import valid2015Tests from "./valid-2015"
import valid2015GenTests from "./valid-2015-gen"
import flagTests, { validTests as validFlagTests } from "./flag"
import lookbehindTests from "./lookbehind"
import * as AST from "../ast"

describe("Parse Regex String", function () {
  Object.entries({
    ...invalid2015Tests,
    ...valid2015Tests,
    ...flagTests,
    ...lookbehindTests,
  }).forEach(([regex, result]) => {
    it(regex, () => {
      expect(parse(regex, true, () => "")).toEqual(result)
    })
  })
})

describe("Gen Regex String", function () {
  Object.entries({
    ...valid2015GenTests,
    ...validFlagTests,
    ...lookbehindTests,
  }).forEach(([regex, result]) => {
    it(regex, () => {
      const ast = result as AST.Regex
      expect(gen(ast, true)).toEqual(regex)
    })
  })
})
