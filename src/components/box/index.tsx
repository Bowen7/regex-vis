import React from "react"
import { useTheme } from "@geist-ui/react"
type Props = {
  title?: string
}
const Box: React.FC<Props> = ({ title = "", children }) => {
  const { palette } = useTheme()
  return (
    <>
      <div className="container">
        <span className="title">{title}</span>
        {children}
      </div>
      <style jsx>{`
        .container {
          border: 1px solid ${palette.accents_2};
          padding: 24px 12px;
          position: relative;
          border-radius: 5px;
        }
        .title {
          font-size: 12px;
          position: absolute;
          top: 0;
          transform: translate(0, -50%);
          background: ${palette.background};
          padding: 0 6px;
        }
      `}</style>
    </>
  )
}
export default Box
