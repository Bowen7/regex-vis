import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import legends from './legends'

function Legend() {
  const { t } = useTranslation()
  return (
    <div className="divide-y-2 *:py-4 first:*:pt-0 last:*:pb-0">
      {/* TODO move the tip to the graph */}
      {/* <div className="tip">
          <ArrowLeftCircle size={14} />
          {t('You can select nodes by dragging or clicking')}
        </div> */}
      {legends.map(({ name, infos }) => (
        <div key={name}>
          <h5>{t(name)}</h5>
          {infos.map(({ Icon, desc }) => (
            <Fragment key={desc}>
              {Icon}
              <span>{t(desc)}</span>
            </Fragment>
          ))}
        </div>
      ))}
    </div>
  )
}

export default Legend
