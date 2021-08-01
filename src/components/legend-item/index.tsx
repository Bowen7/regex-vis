import React from "react"
import { useTheme } from "@geist-ui/react"
type Props = {
  name: string
  infos: {
    desc: string
    Icon: React.ReactNode
  }[]
}
const LegendItem: React.FC<Props> = ({ name, infos }) => {
  const { palette } = useTheme()
  console.log(infos)
  return (
    <>
      <div className="wrapper">
        <h5>{name}:</h5>
        {infos.map(({ Icon, desc }) => (
          <React.Fragment key={desc}>
            {Icon}
            <span className="desc">{desc}</span>
          </React.Fragment>
        ))}
      </div>
      <style jsx>
        {`
          .wrapper {
            border-bottom: 1px solid ${palette.accents_2};
            padding: 12px 0;
          }
          .wrapper :global(> svg) {
            display: block;
          }
          .desc {
            display: block;
            color: ${palette.accents_6};
          }
          .wrapper > span:not(:last-of-type) {
            margin-bottom: 24px;
          }
        `}
      </style>
    </>
  )
}

export default LegendItem
