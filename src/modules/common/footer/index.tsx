import React from "react"
import {useTheme} from "@geist-ui/react"
const Footer: React.FC<{}> = () => {
  const {palette} = useTheme()
  return (
    <>
      <footer>
        Regex-Vis — a solo project by Bowen
      </footer>
      <style jsx>{`
        footer {
          height: 72px;
          color: ${palette.accents_4};
          font-size: 12px;
          line-height: 72px;
          text-align: center;
          user-select: none;
        }
      `}</style>
    </>
  )
}

export default Footer
