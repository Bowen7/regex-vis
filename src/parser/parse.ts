import { parseRegExpLiteral, AST } from "regexpp"
import { nanoid } from "nanoid"
import {
  Node,
  RootNode,
  SingleNode,
  GroupNode,
  CharCollection,
  Char,
  CharRange,
  CharContent,
  ChoiceNode,
  BoundaryAssertionNode,
  LookaroundAssertionNode,
} from "@/types"

const AssertionNameMap = {
  start: "Start of line",
  end: "End of line",
  lookahead: ["Followed by:", "Not followed by"],
  lookbehind: ["Preceded by", "Not Preceded by"],
  word: "",
}
let groupName = 1

function parse(regex: string | RegExp) {
  const nodes: Node[] = []
  groupName = 1
  const ast = parseRegExpLiteral(regex)
  nodes.push(genRootNode())
  nodes.push(...genBodyNode(ast))
  nodes.push(genRootNode())
  return nodes
}

function genRootNode(): RootNode {
  return {
    id: nanoid(),
    type: "root",
  }
}

function genBodyNode(ast: AST.RegExpLiteral) {
  const alternatives = ast.pattern.alternatives
  if (alternatives.length === 1) {
    return parseAlternative(alternatives[0])
  } else {
    return [parseAlternatives(alternatives)]
  }
}

function parseAlternative(ast: AST.Alternative) {
  const elements = mergeElements(ast.elements)

  return elements.map(element => parseElement(element))
}

function parseElement(ast: AST.Element): Node {
  let node!: Node
  switch (ast.type) {
    case "Character":
      node = parseCharacter(ast)
      break
    case "CapturingGroup":
    case "Group":
      node = parseGroup(ast)
      break
    case "Quantifier":
      const { min, max, element } = ast
      node = parseElement(element)
      let text = ""
      if (max !== Infinity) {
        text += Math.max(0, min - 1)
        if (max !== min) {
          text += " - "
          text += max - 1
        }
        text += " times"
      }
      node.quantifier = {
        min,
        max,
        text,
      }
      break
    case "CharacterClass":
      node = parseCharacterClass(ast)
      break
    case "Assertion":
      node = parseAssertion(ast)
      break
    case "CharacterSet":
      node = parseCharacterSet(ast)
      break
    default:
      break
  }
  return node
}

function parseAlternatives(ast: AST.Alternative[]) {
  const node: ChoiceNode = {
    id: nanoid(),
    type: "choice",
    branches: [],
  }

  ast.forEach((alternative, index) => {
    node.branches![index] = parseAlternative(alternative)
  })
  return node
}

function parseCharacter(character: AST.Character): Node {
  return {
    id: nanoid(),
    type: "single",
    val: {
      text: character.raw,
      content: {
        kind: "simple",
        text: character.raw,
      },
    },
  }
}

function parseCharacterSet(characterSet: AST.CharacterSet): SingleNode {
  let content!: CharContent
  switch (characterSet.kind) {
    case "any":
      content = {
        kind: "any",
        text: "any character",
        raw: ".",
      }
      break

    default:
      break
  }
  return {
    id: nanoid(),
    type: "single",
    val: {
      content: content,
      text: content.text,
    },
  }
}

// EdgeAssertion will convert to EdgeAssertionNode
// LookaroundAssertion assertions will convert to GroupNode
function parseAssertion(assertion: AST.Assertion) {
  let node!: Node
  switch (assertion.kind) {
    case "start":
    case "end":
      node = parseEdgeAssertion(assertion)
      break
    case "lookahead":
    case "lookbehind":
      node = parseLookaroundAssertion(assertion)
      break
    case "word":
      node = parseWordBoundaryAssertion(assertion)
      break
    default:
      break
  }
  return node
}

function parseLookaroundAssertion(
  assertion: AST.LookaroundAssertion
): LookaroundAssertionNode {
  const { alternatives, negate, kind } = assertion
  const name = AssertionNameMap[assertion.kind][negate ? 1 : 0]
  const node: LookaroundAssertionNode = {
    id: nanoid(),
    type: "lookaroundAssertion",
    children: [],
    val: {
      kind,
      negate,
      name,
    },
  }
  if (alternatives.length === 1) {
    parseAlternative(alternatives[0])
  } else {
    parseAlternatives(alternatives)
  }
  return node
}

function parseWordBoundaryAssertion(
  assertion: AST.WordBoundaryAssertion
): BoundaryAssertionNode {
  const { kind, negate } = assertion
  return {
    id: nanoid(),
    type: "boundaryAssertion",
    val: {
      text: negate ? "NonWordBoundary" : "WordBoundary",
      kind,
      negate,
    },
  }
}

function parseEdgeAssertion(
  assertion: AST.EdgeAssertion
): BoundaryAssertionNode {
  const text = assertion.kind === "start" ? "Start of line" : "End of line"
  return {
    id: nanoid(),
    type: "boundaryAssertion",
    val: {
      text: text,
      kind: assertion.kind,
    },
  }
}

function parseGroup(ast: AST.CapturingGroup | AST.Group) {
  const alternatives = ast.alternatives
  const node: GroupNode = {
    id: nanoid(),
    type: "group",
    children: [],
    val: {
      kind: "nonCapturing",
      namePrefix: "Group #",
    },
  }
  const val = node.val
  if (ast.type === "CapturingGroup") {
    if (ast.name) {
      val.kind = "namedCapturing"
      val.name = ast.name
    } else {
      val.kind = "capturing"
      val.name = groupName++ + ""
    }
  }
  if (alternatives.length === 1) {
    node.children = parseAlternative(alternatives[0])
  } else {
    node.children = [parseAlternatives(alternatives)]
  }
  return node
}

function parseCharacterClass(ast: AST.CharacterClass): SingleNode {
  const { elements, negate } = ast
  const charCollection: CharCollection = {
    kind: "collection",
    collections: [],
    text: "",
    negate,
  }
  elements.forEach(element => {
    if (element.type === "Character") {
      const text = String.fromCharCode(element.value)
      const char: Char = {
        kind: "simple",
        text,
      }
      charCollection.collections.push(char)
    } else if (element.type === "CharacterClassRange") {
      const { min, max } = element
      const minText = String.fromCharCode(min.value)
      const maxText = String.fromCharCode(max.value)
      const from: Char = {
        kind: "simple",
        text: minText,
      }
      const to: Char = {
        kind: "simple",
        text: maxText,
      }
      const charRange: CharRange = {
        kind: "range",
        from,
        to,
        text: minText + "-" + maxText,
      }
      charCollection.collections.push(charRange)
    }
  })
  const text = charCollection.collections.map(item => item.text).join(", ")
  const name = negate ? "None of " : "One of "
  charCollection.text = text
  return {
    id: nanoid(),
    type: "single",
    val: {
      content: charCollection,
      text: charCollection.text,
      name,
    },
  }
}

function mergeElements(elements: AST.Element[]) {
  const result: AST.Element[] = []
  let lastElement: AST.Element | null = null
  elements.forEach(element => {
    if (element.type === "Character") {
      const raw = String.fromCharCode(element.value)
      if (lastElement) {
        lastElement.raw += raw
      } else {
        lastElement = { ...element, raw }
      }
    } else {
      if (lastElement) {
        result.push(lastElement)
        lastElement = null
      }
      result.push(element)
    }
  })
  if (lastElement) {
    result.push(lastElement)
  }
  return result
}
export default parse
