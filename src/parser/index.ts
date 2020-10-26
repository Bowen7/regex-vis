import { parseRegExpLiteral, AST } from "regexpp"
import { NodeMap, Node, RootNode } from "@types"
let __ID_SEED__ = 0
function parse(regexString: string) {
  const ast = parseRegExpLiteral(regexString)
  const nodeMap: NodeMap = new Map()
  __ID_SEED__ = 0
  const startId = __ID_SEED__
  const startRoot: RootNode = {
    id: startId,
    type: "root",
    prev: null,
    next: startId + 1,
    text: "start",
  }
  nodeMap.set(startId, startRoot)

  __ID_SEED__++

  const alternatives = ast.pattern.alternatives
  let lastId: number
  if (alternatives.length === 1) {
    lastId = parseAlternative(alternatives[0], nodeMap, startId, false)
  } else {
    lastId = parseAlternatives(alternatives, nodeMap, startId, false)
  }

  const endId = __ID_SEED__
  const endRoot: RootNode = {
    id: endId,
    type: "root",
    prev: lastId,
    next: null,
    text: "end",
  }
  nodeMap.set(endId, endRoot)
  return nodeMap
}

function parseAlternatives(
  alternatives: AST.Alternative[],
  nodeMap: NodeMap,
  prevId: number,
  wrap: boolean
) {
  const choiceId = __ID_SEED__++
  const branches: number[] = []
  alternatives.forEach(alternative => {
    branches.push(__ID_SEED__)
    parseAlternative(alternative, nodeMap, choiceId, true)
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

function parseAlternative(
  alternative: AST.Alternative,
  nodeMap: NodeMap,
  prevId: number,
  wrap: boolean
) {
  const elements = mergeElements(alternative.elements)
  const originPrevId = prevId

  elements.forEach((element, index) => {
    if (wrap && index === elements.length - 1) {
      prevId = originPrevId
    }
    const id = __ID_SEED__
    switch (element.type) {
      case "Character":
        parseCharacter(element, nodeMap, prevId)
        break
      case "CapturingGroup":
        parseCapturingGroup(element, nodeMap, prevId)
        break
      default:
        break
    }
    prevId = id
    if (wrap && index === elements.length - 1) {
      const node = nodeMap.get(id) as Node
      node.next = originPrevId
    }
  })
  return prevId
}
function parseCharacter(
  character: AST.Character,
  nodeMap: NodeMap,
  prevId: number
) {
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
function parseCapturingGroup(
  capturingGroup: AST.CapturingGroup,
  nodeMap: NodeMap,
  prevId: number
) {
  const alternatives = capturingGroup.alternatives
  const groupId = __ID_SEED__++
  const groupNode: Node = {
    id: groupId,
    type: "group",
    prev: prevId,
    next: __ID_SEED__,
    head: __ID_SEED__,
  }
  if (alternatives.length === 1) {
    parseAlternative(alternatives[0], nodeMap, groupId, true)
  } else {
    parseAlternatives(alternatives, nodeMap, groupId, true)
  }
  groupNode.next = __ID_SEED__
  nodeMap.set(groupId, groupNode)
}

function mergeElements(elements: AST.Element[]) {
  const result: AST.Element[] = []
  let lastElement: AST.Element | null = null
  elements.forEach(element => {
    if (element.type === "Character") {
      if (lastElement) {
        lastElement.raw += element.raw
      } else {
        lastElement = element
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
// console.log(parse("/ab/"))
const parser = {
  parse,
}
export default parser
