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
  value: "backRef",
}

const classOptions: { value: CharacterClassKey; text: string }[] = []
for (let key in characterClassTextMap) {
  classOptions.push({
    value: key as CharacterClassKey,
    text: characterClassTextMap[key as CharacterClassKey],
  })
}

const labelMap = {
  string: "Value",
  ranges: "Ranges",
  class: "Class",
  backRef: "Back Reference",
}

export { classOptions, labelMap }
