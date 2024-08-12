import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAtomValue } from 'jotai'
import { useLocalStorage } from 'react-use'
import produce from 'immer'
import { useCopyToClipboard } from 'usehooks-ts'
import { Link as LinkIcon, Plus as PlusIcon } from '@phosphor-icons/react'
import { nanoid } from 'nanoid'
import TestItem from '@/components/test-item'
import { gen } from '@/parser'
import { astAtom } from '@/atom'
import { genPermalink } from '@/utils/helpers'
import { STORAGE_TEST_CASES } from '@/constants'
import { useToast } from '@/components/ui/use-toast'
import { Button } from '@/components/ui/button'

type Case = {
  value: string
  id: string
}

function TestTab() {
  const { t } = useTranslation()
  const [casesInStorages, setCasesInStorages] = useLocalStorage<string[]>(STORAGE_TEST_CASES, [''])
  const [cases, setCases] = useState<{
    value: string
    id: string
  }[]>(() => casesInStorages?.map(value => ({ value, id: nanoid() })) ?? [])

  const ast = useAtomValue(astAtom)
  const regExp = useMemo(() => {
    const regex = gen(ast, { literal: false, escapeBackslash: false })
    return new RegExp(regex, ast.flags.join(''))
  }, [ast])

  const { toast } = useToast()
  const [, copy] = useCopyToClipboard()

  const saveCases = (cases: Case[]) => {
    setCases(cases)
    setCasesInStorages(cases.map(({ value }) => value))
  }

  const handleCopyPermalink = () => {
    const permalink = genPermalink(cases.map(({ value }) => value))
    copy(permalink)
    toast({ description: t('Permalink copied.') })
  }

  const handleChange = (value: string, index: number) => {
    saveCases(
      produce(cases!, (draft) => {
        draft[index].value = value
      }),
    )
  }

  const handleRemove = (index: number) => {
    saveCases(
      produce(cases!, (draft) => {
        draft.splice(index, 1)
      }),
    )
  }

  const handleAdd = () => {
    saveCases(
      produce(cases!, (draft) => {
        draft.push({
          value: '',
          id: nanoid(),
        })
      }),
    )
  }

  return (
    <div>
      <div className="space-y-6">
        {cases!.map(({ value, id }, index) => (
          <React.Fragment key={id}>
            <TestItem
              value={value}
              regExp={regExp}
              onChange={value => handleChange(value, index)}
              onRemove={() => handleRemove(index)}
            />
          </React.Fragment>
        ))}
      </div>
      <div className="flex justify-end space-x-2 mt-4">
        <Button variant="ghost" size="icon" onClick={handleAdd}>
          <PlusIcon className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={handleCopyPermalink}>
          <LinkIcon className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

export default TestTab
