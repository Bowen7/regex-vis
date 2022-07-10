import { removeBackslash } from "../backslash"

test("remove backslash", () => {
  expect(removeBackslash("\\n")).toBe("\\n")
  expect(removeBackslash("\\\\n")).toBe("\\n")
  expect(removeBackslash("\\.")).toBe(".")
  expect(removeBackslash("\\\\.")).toBe("\\.")
  expect(() => removeBackslash("\\")).toThrow("Invalid escape sequence")
})
