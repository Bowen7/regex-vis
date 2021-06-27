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
      kind: "string",
      value: character.raw,
    },
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
      kind: "class",
      value: raw,
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
  const node: LookaroundAssertionNode = {
    id: nanoid(),
    type: "lookaroundAssertion",
    children: [],
    value: {
      kind,
      negate,
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
  }
}

function parseEdgeAssertion(
  assertion: AST.EdgeAssertion
): BoundaryAssertionNode {
  return {
    id: nanoid(),
    type: "boundaryAssertion",
    value: {
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
    value: {
      kind: "nonCapturing",
    },
  }
  if (ast.type === "CapturingGroup") {
    if (ast.name) {
      node.value = {
        kind: "namedCapturing",
        name: ast.name,
      }
    } else {
      node.value = {
        kind: "capturing",
        name: groupName++ + "",
      }
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
  elements.forEach((element) => {
    if (element.type === "Character") {
      const from = String.fromCharCode(element.value)
      const range: Range = {
        from: from,
        to: from,
      }
      ranges.push(range)
    } else if (element.type === "CharacterClassRange") {
      const { min, max } = element
      const from = String.fromCharCode(min.value)
      const to = String.fromCharCode(max.value)
      const range: Range = {
        from,
        to,
      }
      ranges.push(range)
    }
  })
  return {
    id: nanoid(),
    type: "character",
    value: {
      kind: "ranges",
      value: ranges,
      negate,
    },
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
