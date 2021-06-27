import { parseRegExpLiteral, AST } from "regexpp"
import { nanoid } from "nanoid"
import {
  Node,
  RootNode,
  CharacterNode,
  GroupNode,
  Range,
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

  return elements.map((element) => parseElement(element))
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
      const { min, max, kind, element, greedy } = ast
      node = parseElement(element)
      node.quantifier = {
        kind,
        min,
        max,
        greedy,
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

function parseCharacter(character: AST.Character): CharacterNode {
  return {
    id: nanoid(),
    type: "character",
    value: {
      type: "string",
      value: character.raw,
    },
    texts: [character.raw],
  }
}

function parseCharacterSet(characterSet: AST.CharacterSet): CharacterNode {
  let text = ""
  let raw = ""
  switch (characterSet.kind) {
    // todo
    case "any":
      text = "any character"
      raw = "."
      break

    default:
      break
  }
  return {
    id: nanoid(),
    type: "character",
    value: {
      type: "class",
      value: raw,
    },
    texts: [text],
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
    value: {
      kind,
      negate,
      name,
    },
  }
  if (alternatives.length === 1) {
    node.children = parseAlternative(alternatives[0])
  } else {
    node.children = [parseAlternatives(alternatives)]
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
    value: {
      kind,
      negate,
    },
    texts: negate ? ["NonWordBoundary"] : ["WordBoundary"],
  }
}

function parseEdgeAssertion(
  assertion: AST.EdgeAssertion
): BoundaryAssertionNode {
  const text = assertion.kind === "start" ? "Start of line" : "End of line"
  return {
    id: nanoid(),
    type: "boundaryAssertion",
    value: {
      kind: assertion.kind,
    },
    texts: [text],
  }
}

function parseGroup(ast: AST.CapturingGroup | AST.Group) {
  const alternatives = ast.alternatives
  const node: GroupNode = {
    id: nanoid(),
    type: "group",
    children: [],
    value: {
      kind: "nonCapturing",
      namePrefix: "Group #",
    },
  }
  const value = node.value
  if (ast.type === "CapturingGroup") {
    if (ast.name) {
      value.kind = "namedCapturing"
      value.name = ast.name
    } else {
      value.kind = "capturing"
      value.name = groupName++ + ""
    }
  }
  if (alternatives.length === 1) {
    node.children = parseAlternative(alternatives[0])
  } else {
    node.children = [parseAlternatives(alternatives)]
  }
  return node
}

function parseCharacterClass(ast: AST.CharacterClass): CharacterNode {
  const { elements, negate } = ast
  const ranges: Range[] = []
  const texts: string[] = []
  elements.forEach((element) => {
    if (element.type === "Character") {
      const text = String.fromCharCode(element.value)
      const range: Range = {
        from: text,
        to: text,
      }
      ranges.push(range)
      texts.push(text)
    } else if (element.type === "CharacterClassRange") {
      const { min, max } = element
      const from = String.fromCharCode(min.value)
      const to = String.fromCharCode(max.value)
      const range: Range = {
        from,
        to,
      }
      ranges.push(range)
      texts.push(from + " - " + to)
    }
  })
  const name = negate ? "None of " : "One of "
  return {
    id: nanoid(),
    type: "character",
    value: {
      type: "ranges",
      value: ranges,
      negate,
    },
    name,
    texts,
  }
}

function mergeElements(elements: AST.Element[]) {
  const result: AST.Element[] = []
  let lastElement: AST.Element | null = null
  elements.forEach((element) => {
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
