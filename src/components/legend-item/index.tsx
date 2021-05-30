import React from "react"
import { useTheme } from "@geist-ui/react"
type Props = {
  name: string
  desc: string
}
const LegendItem: React.FC<Props> = ({ name, desc }) => {
  const { type: themeType, palette } = useTheme()
  return (
    <>
      <div className="wrapper">
        <h5>{name}:</h5>
        <img src={`/assets/${name}-${themeType}.svg`} alt={name} />
        <span className="desc">{desc}</span>
      </div>
      <style jsx>
        {`
          .wrapper {
            border-bottom: 1px solid ${palette.accents_2};
            padding: 12px 0;
          }
          .desc {
            display: block;
            color: ${palette.accents_6};
          }
        `}
      </style>
    </>
  )
}

export default LegendItem
