import { parseRegExpLiteral, AST } from "regexpp"
import {
  NodeMap,
  Node,
  RootNode,
  SingleNode,
  GroupNode,
  CharCollection,
  Char,
  CharRange,
  CharContent,
} from "@types"
const AssertionNameMap = {
  start: "Start of line",
  end: "End of line",
  lookahead: ["Followed by:", "Not followed by"],
  lookbehind: ["Preceded by", "Not Preceded by"],
  word: "",
}
function parse(regex: string | RegExp) {
  let __ID_SEED__ = 0
  let groupName = 1
  const nodeMap: NodeMap = new Map()
  const ast = parseRegExpLiteral(regex)
  const startId = genStartNode()
  const lastId = genBodyNode(ast, startId)
  genEndNode(lastId)
  return nodeMap

  function genStartNode() {
    const startId = __ID_SEED__
    const startNode: RootNode = {
      id: startId,
      type: "root",
      prev: null,
      next: startId + 1,
      text: "start",
    }
    nodeMap.set(startId, startNode)

    __ID_SEED__++
    return startId
  }
  function genBodyNode(ast: AST.RegExpLiteral, startId: number) {
    const alternatives = ast.pattern.alternatives
    let lastId: number
    if (alternatives.length === 1) {
      lastId = parseAlternative(alternatives[0], startId, false)
    } else {
      lastId = parseAlternatives(alternatives, startId, false)
    }
    return lastId
  }
  function genEndNode(lastId: number) {
    const endId = __ID_SEED__
    const endNode: RootNode = {
      id: endId,
      type: "root",
      prev: lastId,
      next: null,
      text: "end",
    }
    nodeMap.set(endId, endNode)
  }
  function parseAlternative(
    ast: AST.Alternative,
    prevId: number,
    wrap: boolean
  ) {
    const elements = mergeElements(ast.elements)
    const originPrevId = prevId

    elements.forEach((element, index) => {
      if (wrap && index === elements.length - 1) {
        prevId = originPrevId
      }
      const id = __ID_SEED__
      handleElement(element, prevId)
      prevId = id
      if (wrap && index === elements.length - 1) {
        const node = nodeMap.get(id) as Node
        node.next = originPrevId
      }
    })
    return prevId
  }
  function handleElement(ast: AST.Element, prevId: number) {
    const id = __ID_SEED__
    switch (ast.type) {
      case "Character":
        parseCharacter(ast, prevId)
        break
      case "CapturingGroup":
      case "Group":
        parseGroup(ast, prevId)
        break
      case "Quantifier":
        const { min, max, element } = ast
        handleElement(element, prevId)
        const node = nodeMap.get(id) as SingleNode | GroupNode
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
        parseCharacterClass(ast, prevId)
        break
      case "Assertion":
        parseAssertion(ast, prevId)
        break
      case "CharacterSet":
        parseCharacterSet(ast, prevId)
        break
      default:
        break
    }
  }
  function parseAlternatives(
    ast: AST.Alternative[],
    prevId: number,
    wrap: boolean
  ) {
    const choiceId = __ID_SEED__++
    const branches: number[] = []
    ast.forEach(alternative => {
      branches.push(__ID_SEED__)
      parseAlternative(alternative, choiceId, true)
    })
    nodeMap.set(choiceId, {
      id: choiceId,
      type: "choice",
      prev: prevId,
      next: wrap ? prevId : __ID_SEED__,
      branches,
    })
    return choiceId
  }
  function parseCharacter(character: AST.Character, prevId: number) {
    const id = __ID_SEED__++
    const node: Node = {
      id,
      type: "single",
      content: {
        kind: "simple",
        value: character.raw,
        text: character.raw,
      },
      text: character.raw,
      prev: prevId,
      next: __ID_SEED__,
    }
    nodeMap.set(id, node)
  }
  function parseCharacterSet(characterSet: AST.CharacterSet, prevId: number) {
    const id = __ID_SEED__++
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
    const node: Node = {
      id,
      type: "single",
      content: content,
      text: content.text,
      prev: prevId,
      next: __ID_SEED__,
    }
    nodeMap.set(id, node)
  }
  // EdgeAssertion will convert to EdgeAssertionNode
  // LookaroundAssertion assertions will convert to GroupNode
  function parseAssertion(assertion: AST.Assertion, prevId: number) {
    switch (assertion.kind) {
      case "start":
      case "end":
        parseEdgeAssertion(assertion, prevId)
        break
      case "lookahead":
      case "lookbehind":
        parseLookaroundAssertion(assertion, prevId)
        break
      case "word":
        parseWordBoundaryAssertion(assertion, prevId)
        break
      default:
        break
    }
  }
  function parseLookaroundAssertion(
    assertion: AST.LookaroundAssertion,
    prevId: number
  ) {
    const id = __ID_SEED__++
    const { alternatives, negate, kind } = assertion
    const name = AssertionNameMap[assertion.kind][negate ? 1 : 0]
    const node: Node = {
      id,
      type: "lookaroundAssertion",
      prev: prevId,
      next: __ID_SEED__,
      head: __ID_SEED__,
      kind,
      negate,
      name,
    }
    if (alternatives.length === 1) {
      parseAlternative(alternatives[0], id, true)
    } else {
      parseAlternatives(alternatives, id, true)
    }
    node.next = __ID_SEED__
    nodeMap.set(id, node)
  }
  function parseWordBoundaryAssertion(
    assertion: AST.WordBoundaryAssertion,
    prevId: number
  ) {
    const id = __ID_SEED__++
    const { kind, negate } = assertion
    const node: Node = {
      id,
      type: "boundaryAssertion",
      text: negate ? "NonWordBoundary" : "WordBoundary",
      prev: prevId,
      next: __ID_SEED__,
      kind,
      negate,
    }
    nodeMap.set(id, node)
  }
  function parseEdgeAssertion(assertion: AST.EdgeAssertion, prevId: number) {
    const id = __ID_SEED__++
    const text = assertion.kind === "start" ? "Start of line" : "End of line"
    const node: Node = {
      id,
      type: "boundaryAssertion",
      text: text,
      prev: prevId,
      next: __ID_SEED__,
      kind: assertion.kind,
    }
    nodeMap.set(id, node)
  }
  function parseGroup(ast: AST.CapturingGroup | AST.Group, prevId: number) {
    const alternatives = ast.alternatives
    let name: string | null = null
    if (ast.type === "CapturingGroup") {
      if (ast.name) {
        name = "Group #" + ast.name
      } else {
        name = "Group #" + groupName++
      }
    }
    const groupId = __ID_SEED__++
    const groupNode: Node = {
      id: groupId,
      type: "group",
      prev: prevId,
      next: __ID_SEED__,
      head: __ID_SEED__,
      name,
    }
    if (alternatives.length === 1) {
      parseAlternative(alternatives[0], groupId, true)
    } else {
      parseAlternatives(alternatives, groupId, true)
    }
    groupNode.next = __ID_SEED__
    nodeMap.set(groupId, groupNode)
  }
  function parseCharacterClass(ast: AST.CharacterClass, prevId: number) {
    const id = __ID_SEED__++
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
    const node: SingleNode = {
      id,
      type: "single",
      prev: prevId,
      next: __ID_SEED__,
      content: charCollection,
      text: charCollection.text,
      name,
    }
    nodeMap.set(id, node)
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
}
export default parse
