import React from "react"
import { useSetAtom, useAtomValue } from "jotai"
import { selectNodeAtom, isPrimaryGraphAtom } from "@/atom"
import { GRAPH_NODE_BORDER_RADIUS } from "@/constants"

type Props = { id: string; selected: boolean } & React.ComponentProps<"rect">

const Content = ({ id, selected, children, ...restProps }: Props) => {
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
          className="selected-fill"
          rx={GRAPH_NODE_BORDER_RADIUS}
          ry={GRAPH_NODE_BORDER_RADIUS}
        ></rect>
      )}
      {children}
    </g>
  )
}

Content.displayName = "Content"
export default Content
