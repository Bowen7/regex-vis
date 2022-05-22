import LRUCache from "lru-cache"
import { AST, characterClassTextMap, CharacterClassKey } from "@/parser"
import i18n from "@/i18n"

const fontFamily = `-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji`
const lruCache = new LRUCache<string, [number, number]>({ max: 100 })
const canvas = document.createElement("canvas")

export const measureText = (text: string, fontSize = 16): [number, number] => {
  const textFont = fontSize + "px " + fontFamily
  const key = textFont + "-" + text
  if (lruCache.has(key)) {
    return lruCache.get(key)!
  }
  const context = canvas.getContext("2d")
  if (!context) {
    return [0, 0]
  }
  context.font = textFont
  const size: [number, number] = [
    context.measureText(text).width,
    fontSize * 1.5,
  ]
  lruCache.set(key, size)
  return size
}

export const measureTexts = (texts: string[], fontSize = 16) => {}

// const getCharacterClassText = (
//   key: string,
//   inRange = false
// ): { text: string; punctuation: string } => {
//   if ((!inRange || key !== ".") && key in characterClassTextMap) {
//     return { text: i18n.t(key), punctuation:
//     "" }
//   }
//   return { text: key, punctuation:  }
// }

// export const getTextsByNode = (
//   node:
//     | AST.CharacterNode
//     | AST.BackReferenceNode
//     | AST.BeginningBoundaryAssertionNode
//     | AST.EndBoundaryAssertionNode
//     | AST.WordBoundaryAssertionNode
// ): { text: string; withQuote: boolean }[] => {
//   switch (node.type) {
//     case "character": {
//       switch (node.kind) {
//         case "string":
//           return [{ text: node.value, withQuote: false }]
//         case "class":
//           return [getCharacterClassText(node.value)]
//         case "ranges": {
//           const singleRangeSet = new Set<string>()
//           const texts: { text: string; withQuote: boolean }[] = []
//           node.ranges.forEach(({ from, to }) => {
//             if (from === to) {
//               if (from.length === 1) {
//                 singleRangeSet.add(from)
//               } else {
//                 texts.push(getCharacterClassText(from, true))
//               }
//             } else {
//               texts.push(${getCharacterClassText(
//                 from,
//                 true
//               )}\` - ${getCharacterClassText(to, true)}`)
//             }
//           })
//           return texts
//         }
//       }
//       throw new Error("unreachable")
//     }
//     case "backReference": {
//       return []
//     }
//     case "boundaryAssertion": {
//       return []
//     }
//   }
// }
