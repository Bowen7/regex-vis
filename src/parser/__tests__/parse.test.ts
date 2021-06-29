import { removeFields } from "tests/utils"
import parse from "../parse"
import parseJson from "./parse.json"

const p = (regex: string) => {
  return removeFields(parse(regex), ["id"])
}

describe("Parse Regex String", function () {
  describe("Character", function () {
    it("single character", function () {
      const r = "/a/"
      expect(p(r)).toEqual(parseJson[r])
    })

    it("multiple character", function () {
      const r = "/abc/"
      expect(p(r)).toEqual(parseJson[r])
    })

    it("normal range", function () {
      const r = "/[a-b]/"
      expect(p(r)).toEqual(parseJson[r])
    })

    it("- head range", function () {
      const r = "/[-b]/"
      expect(p(r)).toEqual(parseJson[r])
    })

    it("- tail range", function () {
      const r = "/[b-]/"
      expect(p(r)).toEqual(parseJson[r])
    })

    it("single range", function () {
      const r = "/[a]/"
      expect(p(r)).toEqual(parseJson[r])
    })

    it("multiple range1", function () {
      const r = "/[a-bb-c]/"
      expect(p(r)).toEqual(parseJson[r])
    })

    it("multiple range2", function () {
      const r = "/[a-bc]/"
      expect(p(r)).toEqual(parseJson[r])
    })

    it("negate range", function () {
      const r = "/[^a-bc]/"
      expect(p(r)).toEqual(parseJson[r])
    })
  })

  describe("Assertion", function () {
    it("^", function () {
      const r = "/^a/"
      expect(p(r)).toEqual(parseJson[r])
    })

    it("$", function () {
      const r = "/a$/"
      expect(p(r)).toEqual(parseJson[r])
    })

    it("\\b", function () {
      const r = "/a\\b/"
      expect(p(r)).toEqual(parseJson[r])
    })
    it("\\B", function () {
      const r = "/a\\B/"
      expect(p(r)).toEqual(parseJson[r])
    })
  })
})
