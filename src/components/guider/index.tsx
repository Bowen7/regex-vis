import React from "react"
import QuestionCircle from "@geist-ui/react-icons/questionCircle"
import { useMainReducer, MainActionTypes } from "@/redux"
type IconProps = React.ComponentProps<typeof QuestionCircle>
type Props = {
  title: string
  content: JSX.Element | string
} & IconProps
const Guider: React.FC<Props> = ({
  title,
  content,
  children,
  ...restProps
}) => {
  const [, dispatch] = useMainReducer()
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()

    dispatch({
      type: MainActionTypes.UPDATE_GUIDE_CONFIG,
      payload: { visible: true, title, content },
    })
  }
  return (
    <>
      <span>
        <QuestionCircle onClick={handleClick} cursor="pointer" {...restProps} />
      </span>
      <style jsx>{`
        span > :global(svg) {
          vertical-align: middle;
          margin-left: 6px;
        }
      `}</style>
    </>
  )
}
export default Guider
