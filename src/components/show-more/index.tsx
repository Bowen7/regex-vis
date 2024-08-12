import React from 'react'
import { useLocalStorage } from 'react-use'
import { useTranslation } from 'react-i18next'
import { CaretDown as CaretDownIcon } from '@phosphor-icons/react'
import clsx from 'clsx'

type Props = {
  id: string
  children: React.ReactNode
}
function ShowMore({ id, children }: Props) {
  const { t } = useTranslation()
  const [expanded, setExpanded] = useLocalStorage(id, false)
  const handleClick = () => setExpanded(!expanded)
  return (
    <>
      {expanded && children}
      <div className="text-center">
        <div className="inline-flex items-center gap-x-2 py-1 px-3 rounded-full cursor-pointer select-none text-xs shadow border" onClick={handleClick}>
          {expanded ? t('show less') : t('show more')}
          <CaretDownIcon className={clsx({ 'rotate-180': expanded }, 'transition-transform')} />
        </div>
      </div>
    </>
  )
}

export default ShowMore
