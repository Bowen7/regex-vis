import { nanoid } from 'nanoid'
import { SingleNode, ChoiceNode, Node } from '@/types'
import visit from '@/parser/visit'
import { replaceFromLists } from './replace'
type InsertDirection = 'prev' | 'next' | 'parallel'
function insert(
  nodes: Node[],
  selectNodes: Node[],
  direction: InsertDirection
) {
  if (selectNodes.length === 0) {
    return
  }
  const start = selectNodes[0]
  visit(nodes, start.id, (_, nodeList) => {
    const startIndex = nodeList.indexOf(start)
    const endIndex = startIndex + nodeList.length - 1

    const node = genNode()
    if (direction === 'prev') {
      nodeList.splice(startIndex, 0, node)
    } else if (direction === 'next') {
      nodeList.splice(endIndex + 1, 0, node)
    } else {
      if (selectNodes.length === 1 && selectNodes[0].branches) {
        selectNodes[0].branches.push([node])
      } else {
        const choiceNode = genChoiceNode()
        choiceNode.branches = [[node], selectNodes]

        replaceFromLists(nodeList, selectNodes, [choiceNode])
      }
    }
  })
}

function genNode(): SingleNode {
  return {
    id: nanoid(),
    type: 'single',
    val: {
      text: '',
      content: {
        kind: 'simple',
        text: '',
      },
    },
  }
}

function genChoiceNode(): ChoiceNode {
  return {
    id: nanoid(),
    type: 'choice',
    branches: [],
  }
}
export default insert
