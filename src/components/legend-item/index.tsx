import React from 'react'
import { useTranslation } from 'react-i18next'

type Props = {
  name: string
  infos: {
    desc: string
    Icon: React.ReactNode
  }[]
}
const LegendItem: React.FC<Props> = ({ name, infos }) => {
  const { t } = useTranslation()
  return (
    <div className="wrapper">
      <h5>
        {t(name)}
        :
      </h5>
      {infos.map(({ Icon, desc }) => (
        <React.Fragment key={desc}>
          {Icon}
          <span className="desc">{t(desc)}</span>
        </React.Fragment>
      ))}
    </div>
  )
}

export default LegendItem
