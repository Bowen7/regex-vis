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
  NodeParent,
  NodePrev,
  ChoiceNode,
  NodeQuantifier,
  BoundaryAssertionNode,
  LookaroundAssertionNode,
} from "@types"
const AssertionNameMap = {
  start: "Start of line",
  end: "End of line",
  lookahead: ["Followed by:", "Not followed by"],
  lookbehind: ["Preceded by", "Not Preceded by"],
  word: "",
}
let groupName = 1
function parse(regex: string | RegExp) {
  groupName = 1
  const ast = parseRegExpLiteral(regex)
  const startNode = genStartNode()
  const lastNode = genBodyNode(ast, startNode, null)
  genEndNode(lastNode)
  return startNode
}
function genStartNode() {
  const node: RootNode = {
    id: nanoid(),
    type: "root",
    prev: null,
    next: null,
    parent: null,
    text: "start",
  }
  return node
}
function genBodyNode(ast: AST.RegExpLiteral, prev: Node, parent: NodeParent) {
  const alternatives = ast.pattern.alternatives
  if (alternatives.length === 1) {
    return parseAlternative(alternatives[0], prev, null)
  } else {
    return parseAlternatives(alternatives, prev, null)
  }
}
function genEndNode(lastNode: NodePrev) {
  const node: RootNode = {
    id: nanoid(),
    type: "root",
    prev: lastNode,
    next: null,
    parent: null,
    text: "end",
  }
  lastNode && (lastNode.next = node)
  return node
}
function parseAlternative(
  ast: AST.Alternative,
  prev: NodePrev,
  parent: NodeParent
) {
  const elements = mergeElements(ast.elements)

  elements.forEach((element, index) => {
    const _prev = parseElement(element, prev, parent)
    if (prev === null && parent) {
      if (parent.type === "choice") {
        parent.chains.push(_prev)
      } else {
        parent.chain = _prev
      }
    }
    prev = _prev
  })
  return prev
}
function parseElement(
  ast: AST.Element,
  prev: NodePrev,
  parent: NodeParent
): Node {
  let node!: Node
  switch (ast.type) {
    case "Character":
      node = parseCharacter(ast, prev, parent)
      break
    case "CapturingGroup":
    case "Group":
      node = parseGroup(ast, prev, parent)
      break
    case "Quantifier":
      const { min, max, element } = ast
      node = parseElement(element, prev, parent) as NodeQuantifier
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
      node = parseCharacterClass(ast, prev, parent)
      break
    case "Assertion":
      node = parseAssertion(ast, prev, parent)
      break
    case "CharacterSet":
      node = parseCharacterSet(ast, prev, parent)
      break
    default:
      break
  }
  prev && (prev.next = node)
  return node
}
function parseAlternatives(
  ast: AST.Alternative[],
  prev: NodePrev,
  parent: NodeParent
) {
  const node: ChoiceNode = {
    id: nanoid(),
    type: "choice",
    prev,
    next: null,
    parent,
    chains: [],
  }
  ast.forEach(alternative => {
    parseAlternative(alternative, null, node)
  })
  prev && (prev.next = node)
  return node
}
function parseCharacter(
  character: AST.Character,
  prev: NodePrev,
  parent: NodeParent
): Node {
  return {
    id: nanoid(),
    type: "single",
    text: character.raw,
    prev,
    next: null,
    parent,
    content: {
      kind: "simple",
      value: character.raw,
      text: character.raw,
    },
  }
}
function parseCharacterSet(
  characterSet: AST.CharacterSet,
  prev: NodePrev,
  parent: NodeParent
): SingleNode {
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
    prev,
    next: null,
    parent,
    content: content,
    text: content.text,
  }
}
// EdgeAssertion will convert to EdgeAssertionNode
// LookaroundAssertion assertions will convert to GroupNode
function parseAssertion(
  assertion: AST.Assertion,
  prev: NodePrev,
  parent: NodeParent
) {
  let node!: Node
  switch (assertion.kind) {
    case "start":
    case "end":
      node = parseEdgeAssertion(assertion, prev, parent)
      break
    case "lookahead":
    case "lookbehind":
      node = parseLookaroundAssertion(assertion, prev, parent)
      break
    case "word":
      node = parseWordBoundaryAssertion(assertion, prev, parent)
      break
    default:
      break
  }
  return node
}
function parseLookaroundAssertion(
  assertion: AST.LookaroundAssertion,
  prev: NodePrev,
  parent: NodeParent
): LookaroundAssertionNode {
  const { alternatives, negate, kind } = assertion
  const name = AssertionNameMap[assertion.kind][negate ? 1 : 0]
  const node: LookaroundAssertionNode = {
    id: nanoid(),
    type: "lookaroundAssertion",
    prev: prev,
    next: null,
    parent,
    chain: null,
    kind,
    negate,
    name,
  }
  if (alternatives.length === 1) {
    parseAlternative(alternatives[0], null, node)
  } else {
    parseAlternatives(alternatives, null, node)
  }
  return node
}
function parseWordBoundaryAssertion(
  assertion: AST.WordBoundaryAssertion,
  prev: NodePrev,
  parent: NodeParent
): BoundaryAssertionNode {
  const { kind, negate } = assertion
  return {
    id: nanoid(),
    type: "boundaryAssertion",
    text: negate ? "NonWordBoundary" : "WordBoundary",
    prev,
    next: null,
    parent,
    kind,
    negate,
  }
}
function parseEdgeAssertion(
  assertion: AST.EdgeAssertion,
  prev: NodePrev,
  parent: NodeParent
): BoundaryAssertionNode {
  const text = assertion.kind === "start" ? "Start of line" : "End of line"
  return {
    id: nanoid(),
    type: "boundaryAssertion",
    text: text,
    prev: prev,
    next: null,
    parent,
    kind: assertion.kind,
  }
}
function parseGroup(
  ast: AST.CapturingGroup | AST.Group,
  prev: NodePrev,
  parent: NodeParent
) {
  const alternatives = ast.alternatives
  const node: GroupNode = {
    id: nanoid(),
    type: "group",
    prev,
    next: null,
    parent,
    chain: null,
  }
  if (ast.type === "CapturingGroup") {
    if (ast.name) {
      node.name = "Group #" + ast.name
    } else {
      node.name = "Group #" + groupName++
    }
  }
  if (alternatives.length === 1) {
    parseAlternative(alternatives[0], null, node)
  } else {
    parseAlternatives(alternatives, null, node)
  }
  return node
}
function parseCharacterClass(
  ast: AST.CharacterClass,
  prev: NodePrev,
  parent: NodeParent
): SingleNode {
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
        value: text,
        text,
      }
      charCollection.collections.push(char)
    } else if (element.type === "CharacterClassRange") {
      const { min, max } = element
      const minText = String.fromCharCode(min.value)
      const maxText = String.fromCharCode(max.value)
      const from: Char = {
        kind: "simple",
        value: minText,
        text: minText,
      }
      const to: Char = {
        kind: "simple",
        value: maxText,
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
    prev: prev,
    next: null,
    parent,
    content: charCollection,
    text: charCollection.text,
    name,
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
