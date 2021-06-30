import { removeFields } from "tests/utils"
import parse from "../parse"
import result from "./parse.result"

const p = (regex: string) => {
  return removeFields(parse(regex), ["id"])
}

describe("Parse Regex String", function () {
  describe("Character", function () {
    it("single character", function () {
      const r = "/a/"
      expect(p(r)).toEqual(result[r])
    })

    it("multiple character", function () {
      const r = "/abc/"
      expect(p(r)).toEqual(result[r])
    })

    it("normal range", function () {
      const r = "/[a-b]/"
      expect(p(r)).toEqual(result[r])
    })

    it("- head range", function () {
      const r = "/[-b]/"
      expect(p(r)).toEqual(result[r])
    })

    it("- tail range", function () {
      const r = "/[b-]/"
      expect(p(r)).toEqual(result[r])
    })

    it("single range", function () {
      const r = "/[a]/"
      expect(p(r)).toEqual(result[r])
    })

    it("multiple range1", function () {
      const r = "/[a-bb-c]/"
      expect(p(r)).toEqual(result[r])
    })

    it("multiple range2", function () {
      const r = "/[a-bc]/"
      expect(p(r)).toEqual(result[r])
    })

    it("negate range", function () {
      const r = "/[^a-bc]/"
      expect(p(r)).toEqual(result[r])
    })
  })

  describe("assertion", function () {
    it("^", function () {
      const r = "/^a/"
      expect(p(r)).toEqual(result[r])
    })

    it("$", function () {
      const r = "/a$/"
      expect(p(r)).toEqual(result[r])
    })

    it("\\b", function () {
      const r = "/a\\b/"
      expect(p(r)).toEqual(result[r])
    })
    it("\\B", function () {
      const r = "/a\\B/"
      expect(p(r)).toEqual(result[r])
    })

    it("lookahead assertion", function () {
      const r = "/x(?=y)/"
      expect(p(r)).toEqual(result[r])
    })

    it("negative lookahead assertion", function () {
      const r = "/x(?!y)/"
      expect(p(r)).toEqual(result[r])
    })

    it("lookbehind assertion", function () {
      const r = "/(?<=y)x/"
      expect(p(r)).toEqual(result[r])
    })

    it("negative lookbehind assertion", function () {
      const r = "/(?<!y)x/"
      expect(p(r)).toEqual(result[r])
    })
  })

  describe("choice", function () {
    const r = "/a|b/"
    expect(p(r)).toEqual(result[r])
  })

  describe("group", function () {
    it("capturing group", function () {
      const r = "/(a)/"
      expect(p(r)).toEqual(result[r])
    })

    it("named capturing group", function () {
      const r = "/(?<b>a)/"
      expect(p(r)).toEqual(result[r])
    })

    it("non-capturing group", function () {
      const r = "/(?:a)/"
      expect(p(r)).toEqual(result[r])
    })

    // TODO: back reference
  })

  describe("quantifiers", function () {
    it("*", function () {
      const r = "/a*/"
      expect(p(r)).toEqual(result[r])
    })

    it("+", function () {
      const r = "/a+/"
      expect(p(r)).toEqual(result[r])
    })

    it("?", function () {
      const r = "/a?/"
      expect(p(r)).toEqual(result[r])
    })

    it("{n}", function () {
      const r = "/a{2}/"
      expect(p(r)).toEqual(result[r])
    })

    it("{n,}", function () {
      const r = "/a{2,}/"
      expect(p(r)).toEqual(result[r])
    })

    it("{n,m}", function () {
      const r = "/a{2,4}/"
      expect(p(r)).toEqual(result[r])
    })

    it("non-greedy", function () {
      const r = "/a*?/"
      expect(p(r)).toEqual(result[r])
    })
  })

  describe("character class", function () {
    it(".", function () {
      const r = "/./"
      expect(p(r)).toEqual(result[r])
    })
  })
})
