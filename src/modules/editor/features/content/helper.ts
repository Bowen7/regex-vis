import { characterClassTextMap, CharacterClassKey } from "@/parser"
export const characterOptions = [
  {
    label: "Simple string",
    value: "string",
  },
  {
    label: "Character class",
    value: "class",
  },
  {
    label: "Character range",
    value: "ranges",
  },
]
export const backRefOption = {
  label: "Back reference",
  value: "backReference",
}

export const beginningAssertionOption = {
  label: "Beginning Assertion",
  value: "beginningAssertion",
}

export const endAssertionOption = {
  label: "End Assertion",
  value: "endAssertion",
}

export const wordBoundaryAssertionOption = {
  label: "Word Boundary Assertion",
  value: "wordBoundaryAssertion",
}

const classOptions: { value: CharacterClassKey; text: string }[] = []
for (let key in characterClassTextMap) {
  classOptions.push({
    value: key as CharacterClassKey,
    text: characterClassTextMap[key as CharacterClassKey],
  })
}

export { classOptions }
