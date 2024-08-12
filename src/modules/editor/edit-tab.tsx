import { useEffect, useState } from 'react'
import { useAtomValue } from 'jotai'
import ContentEditor from './features/content'
import Group from './features/group'
import Expression from './features/expression'
import Quantifier from './features/quantifier'
import LookAround from './features/look-around'
import Insert from './features/insert'
import type { NodesInfo } from './utils'
import { genInitialNodesInfo, getInfoFromNodes } from './utils'
import type { AST } from '@/parser'
import { getNodesByIds } from '@/parser/visit'
import { astAtom, selectedIdsAtom } from '@/atom'

function EditTab() {
  const [nodes, setNodes] = useState<AST.Node[]>([])
  const selectedIds = useAtomValue(selectedIdsAtom)
  const ast = useAtomValue(astAtom)

  useEffect(() => {
    if (selectedIds.length === 0) {
      return setNodes([])
    }
    setNodes(getNodesByIds(ast, selectedIds).nodes)
  }, [ast, selectedIds])

  const [nodesInfo, setNodesInfo] = useState<NodesInfo>(genInitialNodesInfo())

  const {
    id,
    regex,
    startIndex,
    endIndex,
    group,
    content,
    hasQuantifier,
    quantifier,
    lookAround,
  } = nodesInfo

  useEffect(() => {
    const nodesInfo = getInfoFromNodes(ast, nodes)
    setNodesInfo(nodesInfo)
  }, [ast, nodes])

  return (
    <div data-testid="edit-tab" className="space-y-6">
      <Insert nodes={nodes} />
      <Expression regex={regex} startIndex={startIndex} endIndex={endIndex} />
      {content && (
        <ContentEditor content={content} id={id} quantifier={quantifier} />
      )}
      {group && <Group group={group} />}
      {hasQuantifier && <Quantifier quantifier={quantifier} key={id} />}
      {lookAround && (
        <LookAround kind={lookAround.kind} negate={lookAround.negate} />
      )}
    </div>
  )
}

export default EditTab
