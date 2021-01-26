import { nanoid } from 'nanoid'
import { Node, GroupNode, RootNode, GroupKind } from '@/types'
import visit, { visitTree } from '@/parser/visit'
function group(
  nodes: Node[],
  selectNodes: Node[],
  type: GroupKind | 'nonGroup',
  name?: string
) {
  if (selectNodes.length === 1 && selectNodes[0].type === 'group') {
    changeGroupType(nodes, selectNodes[0], type, name)
  } else {
    const head = nodes[0]
    const tail = nodes[nodes.length - 1]
    const node: GroupNode = {
      id: nanoid(),
      type: 'group',
      val: {
        kind: 'capturing',
        name: '',
        namePrefix: 'Group #',
      },
      children: [],
    }
    changeGroupType(nodes, node, type, name)
  }
  refreshGroupName(nodes)
}
function changeGroupType(
  nodes: Node[],
  selectedNode: GroupNode,
  type: GroupKind | 'nonGroup',
  name?: string
) {
  const { val } = selectedNode
  switch (type) {
    case 'nonGroup':
      removeGroupWrap(nodes, selectedNode)
      break
    case 'capturing':
      val.kind = 'capturing'
      break
    case 'namedCapturing':
      val.kind = 'namedCapturing'
      val.name = name
      break
    case 'nonCapturing':
      val.kind = 'nonCapturing'
      delete val.name
      break
    default:
      break
  }
}

function removeGroupWrap(nodes: Node[], selectNode: GroupNode) {
  visit(nodes, selectNode.id, (_, nodeList) => {
    const { children } = selectNode as { children: Node[] }
    const index = nodeList.indexOf(selectNode)
    nodeList.splice(index, 1, ...children)
  })
}

function refreshGroupName(nodes: Node[]) {
  let groupIndex = 1
  visitTree(nodes, (node: Node) => {
    if (node.type === 'group' && node.val.kind === 'capturing') {
      node.val.name = groupIndex++ + ''
    }
  })
}
export default group
