import { useTranslation } from 'react-i18next'
import legends from './legends'

function Legend() {
  const { t } = useTranslation()
  return (
    <div className="divide-y *:py-4 first:*:pt-0 last:*:pb-0">
      {/* TODO move the tip to the graph */}
      {/* <div className="tip">
          <ArrowLeftCircle size={14} />
          {t('You can select nodes by dragging or clicking')}
        </div> */}
      {legends.map(({ name, infos }) => (
        <div key={name}>
          <h5 className="font-bold mb-4">{t(name)}</h5>
          <div className="space-y-6">
            {infos.map(({ Icon, desc }) => (
              <div key={desc}>
                {Icon}
                <span className="text-foreground/80">{t(desc)}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default Legend
