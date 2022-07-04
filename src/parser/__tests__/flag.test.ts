import parse from "../parse"

test("parse should return error when receiving invalid flags", () => {
  const expected = {
    type: "error",
    message: `Invalid regular expression flags 'z'`,
  }
  const result = parse("/(?:)/z", { idGenerator: () => "" })
  expect(result).toEqual(expected)
})

test("parse should return correct ast when receiving flags", () => {
  const expected = {
    id: "",
    type: "regex",
    body: [
      {
        id: "",
        type: "group",
        kind: "nonCapturing",
        children: [],
        quantifier: null,
      },
    ],
    flags: ["g"],
    literal: true,
  }
  const result = parse("/(?:)/g", { idGenerator: () => "" })
  expect(result).toEqual(expected)
})
