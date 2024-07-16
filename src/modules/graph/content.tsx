import React from 'react'
import { useAtomValue, useSetAtom } from 'jotai'
import { isPrimaryGraphAtom, selectNodeAtom } from '@/atom'
import { GRAPH_NODE_BORDER_RADIUS } from '@/constants'

type Props = { id: string, selected: boolean } & React.ComponentProps<'rect'>

function Content({ id, selected, children, ...restProps }: Props) {
  const selectNode = useSetAtom(selectNodeAtom)
  const isPrimaryGraph = useAtomValue(isPrimaryGraphAtom)
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (isPrimaryGraph) {
      selectNode(id)
    }
  }
  return (
    <g onClick={handleClick}>
      <rect {...restProps}></rect>
      {selected && (
        <rect
          {...restProps}
          className="fill-blue-500/30"
          rx={GRAPH_NODE_BORDER_RADIUS}
          ry={GRAPH_NODE_BORDER_RADIUS}
        >
        </rect>
      )}
      {children}
    </g>
  )
}

Content.displayName = 'Content'
export default Content
