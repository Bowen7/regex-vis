import { deepStrictEqual } from "assert"
import parse from "../parse"
import parseJson from "./parse.json"

const removeFields = (target: any, keys: string[]) => {
  if (Array.isArray(target)) {
    target.forEach((item) => removeFields(item, keys))
  } else if ({}.toString.call(target) === "[object Object]") {
    Object.keys(target).forEach((key) => {
      if (keys.includes(key)) {
        delete target[key]
      } else {
        removeFields(target[key], keys)
      }
    })
  }
  return target
}

const p = (regex: string) => {
  return removeFields(parse(regex), ["id"])
}

describe("Parse Regex String", function () {
  describe("Character", function () {
    it("single character", function () {
      const r = "/a/"
      deepStrictEqual(p(r), parseJson[r])
    })

    it("multiple character", function () {
      const r = "/abc/"
      deepStrictEqual(p(r), parseJson[r])
    })
  })
})
