import parse from "../parse"
import gen from "../gen"

const g = (r: string) => gen(parse(r), true)
describe("Parse Regex String", function () {
  describe("Character", function () {
    it("single character", function () {
      const r = "/a/"
      expect(g(r)).toEqual(r)
    })

    it("multiple character", function () {
      const r = "/abc/"
      expect(g(r)).toEqual(r)
    })

    it("normal range", function () {
      const r = "/[a-b]/"
      expect(g(r)).toEqual(r)
    })

    it("- head range", function () {
      const r = "/[-b]/"
      expect(g(r)).toEqual(r)
    })

    it("- tail range", function () {
      const r = "/[b-]/"
      expect(g(r)).toEqual(r)
    })

    it("single range", function () {
      const r = "/[a]/"
      expect(g(r)).toEqual(r)
    })

    it("multiple range1", function () {
      const r = "/[a-bb-c]/"
      expect(g(r)).toEqual(r)
    })

    it("multiple range2", function () {
      const r = "/[a-bc]/"
      expect(g(r)).toEqual(r)
    })

    it("negate range", function () {
      const r = "/[^a-bc]/"
      expect(g(r)).toEqual(r)
    })
  })

  describe("assertion", function () {
    it("^", function () {
      const r = "/^a/"
      expect(g(r)).toEqual(r)
    })

    it("$", function () {
      const r = "/a$/"
      expect(g(r)).toEqual(r)
    })

    it("\\b", function () {
      const r = "/a\\b/"
      expect(g(r)).toEqual(r)
    })
    it("\\B", function () {
      const r = "/a\\B/"
      expect(g(r)).toEqual(r)
    })

    it("lookahead assertion", function () {
      const r = "/x(?=y)/"
      expect(g(r)).toEqual(r)
    })

    it("negative lookahead assertion", function () {
      const r = "/x(?!y)/"
      expect(g(r)).toEqual(r)
    })

    it("lookbehind assertion", function () {
      const r = "/(?<=y)x/"
      expect(g(r)).toEqual(r)
    })

    it("negative lookbehind assertion", function () {
      const r = "/(?<!y)x/"
      expect(g(r)).toEqual(r)
    })
  })

  describe("choice", function () {
    const r = "/a|b/"
    expect(g(r)).toEqual(r)
  })

  describe("group", function () {
    it("capturing group", function () {
      const r = "/(a)/"
      expect(g(r)).toEqual(r)
    })

    it("named capturing group", function () {
      const r = "/(?<b>a)/"
      expect(g(r)).toEqual(r)
    })

    it("non-capturing group", function () {
      const r = "/(?:a)/"
      expect(g(r)).toEqual(r)
    })

    // TODO: back reference
  })

  describe("quantifiers", function () {
    it("*", function () {
      const r = "/a*/"
      expect(g(r)).toEqual(r)
    })

    it("+", function () {
      const r = "/a+/"
      expect(g(r)).toEqual(r)
    })

    it("?", function () {
      const r = "/a?/"
      expect(g(r)).toEqual(r)
    })

    it("{n}", function () {
      const r = "/a{2}/"
      expect(g(r)).toEqual(r)
    })

    it("{n,}", function () {
      const r = "/a{2,}/"
      expect(g(r)).toEqual(r)
    })

    it("{n,m}", function () {
      const r = "/a{2,4}/"
      expect(g(r)).toEqual(r)
    })

    it("non-greedy", function () {
      const r = "/a*?/"
      expect(g(r)).toEqual(r)
    })
  })

  describe("character class", function () {
    it(".", function () {
      const r = "/./"
      expect(g(r)).toEqual(r)
    })
  })
})
