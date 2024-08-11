import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Question as QuestionIcon } from '@phosphor-icons/react'
import { useAtomValue, useSetAtom } from 'jotai'
import { nanoid } from 'nanoid'
import SimpleString from './simple-string'
import ClassCharacter from './class-character'
import BackRef from './back-ref'
import WordBoundary from './word-boundary'
import {
  backRefOption,
  beginningAssertionOption,
  characterOptions,
  endAssertionOption,
  wordBoundaryAssertionOption,
} from './helper'
import Ranges from './ranges'
import { astAtom, groupNamesAtom, updateContentAtom } from '@/atom'
import mdnLinks, { isMdnLinkKey } from '@/utils/links'
import type { AST } from '@/parser'
import Cell from '@/components/cell'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

type Prop = {
  content: AST.Content
  id: string
  quantifier: AST.Quantifier | null
}
const ContentEditor: React.FC<Prop> = ({ content, id, quantifier }) => {
  const { t } = useTranslation()
  const groupNames = useAtomValue(groupNamesAtom)
  const ast = useAtomValue(astAtom)
  const updateContent = useSetAtom(updateContentAtom)
  const { kind } = content

  const options = useMemo(() => {
    const options = [...characterOptions, wordBoundaryAssertionOption]
    if (groupNames.length !== 0 || kind === 'backReference') {
      options.push(backRefOption)
    }
    if (
      (ast.body.length > 0 && ast.body[0].id === id)
      || kind === 'beginningAssertion'
    ) {
      options.push(beginningAssertionOption)
    }
    if (
      (ast.body.length > 0 && ast.body[ast.body.length - 1].id === id)
      || kind === 'endAssertion'
    ) {
      options.push(endAssertionOption)
    }
    return options
  }, [groupNames, kind, ast, id])

  const onTypeChange = (type: string | string[]) => {
    let payload: AST.Content
    switch (type) {
      case 'string':
        payload = { kind: 'string', value: '' }
        break
      case 'class':
        payload = { kind: 'class', value: '' }
        break
      case 'ranges':
        payload = {
          kind: 'ranges',
          ranges: [{ id: nanoid(), from: '', to: '' }],
          negate: false,
        }
        break
      case 'backReference':
        payload = { kind: 'backReference', ref: '1' }
        break
      case 'beginningAssertion':
      case 'endAssertion':
        payload = { kind: type }
        break
      case 'wordBoundaryAssertion':
        payload = { kind: 'wordBoundaryAssertion', negate: false }
        break
      default:
        return
    }
    updateContent(payload)
  }

  return (
    <Cell label={t('Content')} className="space-y-6">
      <Cell.Item label={t('Type')}>
        <div className="flex items-center space-x-2">
          <Select value={content.kind} onValueChange={onTypeChange}>
            <SelectTrigger className="w-52">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {options.map(({ value, label }) => (
                  <SelectItem value={value} key={value}>
                    <span>{t(label)}</span>
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          {isMdnLinkKey(content.kind) && (
            <a href={mdnLinks[content.kind]} target="_blank" rel="noreferrer">
              <QuestionIcon className="w-4 h-4" />
            </a>
          )}
        </div>
      </Cell.Item>

      {content.kind === 'string' && (
        <SimpleString value={content.value} quantifier={quantifier} />
      )}
      {content.kind === 'ranges' && (
        <Ranges ranges={content.ranges} negate={content.negate} />
      )}
      {content.kind === 'class' && <ClassCharacter value={content.value} key={id} />}
      {content.kind === 'backReference' && (
        <BackRef reference={content.ref} />
      )}
      {content.kind === 'wordBoundaryAssertion' && (
        <WordBoundary negate={content.negate} />
      )}
    </Cell>
  )
}

export default ContentEditor
