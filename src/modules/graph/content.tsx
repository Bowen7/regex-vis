import React from "react"
import { useSetAtom, useAtomValue } from "jotai"
import { selectNodeAtom, selectEnableAtom } from "@/atom"
import { GRAPH_NODE_BORDER_RADIUS } from "@/constants"

type Props = { id: string; selected: boolean } & React.ComponentProps<"rect">

const Content = ({ id, selected, children, ...restProps }: Props) => {
  const selectNode = useSetAtom(selectNodeAtom)
  const selectEnable = useAtomValue(selectEnableAtom)
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (selectEnable) {
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
