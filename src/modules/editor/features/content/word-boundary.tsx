import React from 'react'
import { useTranslation } from 'react-i18next'
import { useSetAtom } from 'jotai'
import Cell from '@/components/cell'
import { updateContentAtom } from '@/atom'

interface Props {
  negate: boolean
}
const SimpleString: React.FC<Props> = ({ negate }) => {
  const { t } = useTranslation()
  const updateContent = useSetAtom(updateContentAtom)
  // const handleChange = (e: CheckboxEvent) => {
  //   const negate = e.target.checked
  //   updateContent({
  //     kind: 'wordBoundaryAssertion',
  //     negate,
  //   })
  // }

  return (
    <Cell.Item label={t('Negate')}>
      {/* <Checkbox checked={negate} onChange={handleChange}>
        {t('negate')}
      </Checkbox> */}
      <></>
    </Cell.Item>
  )
}

export default SimpleString
