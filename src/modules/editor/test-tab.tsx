import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useAtomValue } from 'jotai'
import { useLocalStorage } from 'react-use'
import produce from 'immer'
import { useCopyToClipboard } from 'usehooks-ts'
import { Link as LinkIcon, Plus as PlusIcon } from '@phosphor-icons/react'
import TestItem from '@/components/test-item'
import { gen } from '@/parser'
import { astAtom } from '@/atom'
import { genPermalink } from '@/utils/helpers'
import { STORAGE_TEST_CASES } from '@/constants'
import { useToast } from '@/components/ui/use-toast'
import { Button } from '@/components/ui/button'

function TestTab() {
  const { t } = useTranslation()
  const [cases, setCases] = useLocalStorage<string[]>(STORAGE_TEST_CASES, [''])
  const ast = useAtomValue(astAtom)
  const regExp = useMemo(() => {
    const regex = gen(ast, { literal: false, escapeBackslash: false })
    return new RegExp(regex, ast.flags.join(''))
  }, [ast])

  const { toast } = useToast()
  const [, copy] = useCopyToClipboard()

  // const { setToast } = useToasts()
  // const { copy } = useClipboard()

  const handleCopyPermalink = () => {
    const permalink = genPermalink(cases)
    copy(permalink)
    toast({ description: t('Permalink copied.') })
  }

  const handleChange = (value: string, index: number) => {
    setCases(
      produce(cases!, (draft) => {
        draft[index] = value
      }),
    )
  }

  const handleRemove = (index: number) => {
    setCases(
      produce(cases!, (draft) => {
        draft.splice(index, 1)
      }),
    )
  }

  const handleAdd = () => {
    setCases(
      produce(cases!, (draft) => {
        draft.push('')
      }),
    )
  }

  return (
    <>
      <div>
        <div className="space-y-6">
          {cases!.map((value, index) => (
            <React.Fragment key={index}>
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
      {/* <style jsx>
        {`
        .wrapper {
          padding: 24px 12px;
        }
        .btn {
          display: flex;
          justify-content: center;
          margin-top: 12px;
        }
      `}
      </style> */}
    </>
  )
}

export default TestTab
