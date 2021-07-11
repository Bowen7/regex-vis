import { default as _parse } from "../../parse_new"
import basicInvalid2015U from "./basic-invalid-2015-u"

const parse = (regex: string) =>
  JSON.parse(
    JSON.stringify(_parse(regex), (k, v) => {
      if (k !== "id") {
        return v
      }
    })
  )

describe("Parse Regex String", function () {
  Object.entries(basicInvalid2015U).forEach(([regex, result]) => {
    it(regex, () => {
      expect(parse(regex)).toEqual(result)
    })
  })
})
