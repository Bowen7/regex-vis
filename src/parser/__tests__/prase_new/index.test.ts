import parse from "../../parse_new"
import invalid2015 from "./invalid-2015"
import valid2015 from "./valid-2015"

describe("Parse Regex String", function () {
  Object.entries(invalid2015).forEach(([regex, result]) => {
    it(regex, () => {
      expect(parse(regex, () => "")).toEqual(result)
    })
  })

  Object.entries(valid2015).forEach(([regex, result]) => {
    it(regex, () => {
      expect(parse(regex, () => "")).toEqual(result)
    })
  })
})
