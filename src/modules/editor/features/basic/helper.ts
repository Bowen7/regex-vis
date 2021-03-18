import {
  characterClassTextMap,
  CharacterClassKey,
} from "@/parser/utils/character-class"
export const charactersOptions = [
  {
    label: "Simple string",
    value: "string",
  },
  {
    label: "Character range",
    value: "ranges",
  },
  {
    label: "Character class",
    value: "class",
  },
]

const classOptions: { value: CharacterClassKey; text: string }[] = []
for (let key in characterClassTextMap) {
  classOptions.push({
    value: key as CharacterClassKey,
    text: characterClassTextMap[key as CharacterClassKey],
  })
}

export { classOptions }
