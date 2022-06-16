import { useSetAtom, useAtomValue } from "jotai"
import { selectNodeAtom, selectEnableAtom } from "@/atom"

type Props = { id: string; selected: boolean } & React.ComponentProps<"rect">

const Content = ({ id, selected, children, ...restProps }: Props) => {
  const selectNode = useSetAtom(selectNodeAtom)
  const selectEnable = useAtomValue(selectEnableAtom)
  const handleClick = () => {
    if (selectEnable) {
      selectNode(id)
    }
  }
  return (
    <g onClick={handleClick}>
      <rect {...restProps}></rect>
      {selected && <rect {...restProps} className="selected-fill"></rect>}
      {children}
    </g>
  )
}

Content.displayName = "Content"
export default Content
