import { parseRegExpLiteral, AST } from "regexpp"
import { NodeMap, Node, RootNode, BasicNode, GroupNode } from "@types"
function parse(regex: string | RegExp) {
  let __ID_SEED__ = 0
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
        parseCapturingGroup(ast, prevId)
        break
      case "Quantifier":
        const { min, max, element } = ast
        handleElement(element, prevId)
        const node = nodeMap.get(id) as BasicNode | GroupNode
        node.quantifier = {
          min,
          max,
        }
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
      type: "basic",
      body: {
        type: "simple",
        value: character.raw,
        text: character.raw,
      },
      prev: prevId,
      next: __ID_SEED__,
    }
    nodeMap.set(id, node)
  }
  function parseCapturingGroup(ast: AST.CapturingGroup, prevId: number) {
    const alternatives = ast.alternatives
    const groupId = __ID_SEED__++
    const groupNode: Node = {
      id: groupId,
      type: "group",
      prev: prevId,
      next: __ID_SEED__,
      head: __ID_SEED__,
    }
    if (alternatives.length === 1) {
      parseAlternative(alternatives[0], groupId, true)
    } else {
      parseAlternatives(alternatives, groupId, true)
    }
    groupNode.next = __ID_SEED__
    nodeMap.set(groupId, groupNode)
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
