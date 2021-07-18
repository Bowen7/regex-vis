import parse from "../../parse_new"
import invalid2015Tests from "./invalid-2015"
import valid2015Tests from "./valid-2015"
import flagTests from "./flag"
import lookbehindTests from "./lookbehind"

describe("Parse Regex String", function () {
  Object.entries(invalid2015Tests).forEach(([regex, result]) => {
    it(regex, () => {
      expect(parse(regex, () => "")).toEqual(result)
    })
  })

  Object.entries(valid2015Tests).forEach(([regex, result]) => {
    it(regex, () => {
      expect(parse(regex, () => "")).toEqual(result)
    })
  })

  Object.entries(flagTests).forEach(([regex, result]) => {
    it(regex, () => {
      expect(parse(regex, () => "")).toEqual(result)
    })
  })

  Object.entries(lookbehindTests).forEach(([regex, result]) => {
    it(regex, () => {
      expect(parse(regex, () => "")).toEqual(result)
    })
  })
})
