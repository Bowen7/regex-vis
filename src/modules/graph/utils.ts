import { useMemo } from 'react'
import type { TFunction } from 'react-i18next'
import type { NodeSize } from './measure'
import { DEFAULT_SIZE } from './measure'
import type { AST, CharacterClassKey } from '@/parser'
import { characterClassTextMap } from '@/parser'

const assertionTextMap = {
  beginning: 'Begin with',
  end: 'End with',
  lookahead: ['Followed by:', 'Not followed by'],
  lookbehind: ['Preceded by', 'Not Preceded by'],
  word: ['WordBoundary', 'NonWordBoundary'],
}

export const getNameText = (node: AST.Node, t: TFunction): string | null => {
  switch (node.type) {
    case 'character':
      if (node.kind === 'ranges') {
        return t(node.negate ? 'None of' : 'One of')
      }
      break
    case 'group':
      if (node.kind === 'capturing' || node.kind === 'namedCapturing') {
        return `${t('Group')} #${node.name}`
      }
      break
    case 'lookAroundAssertion': {
      const { kind, negate } = node
      return t(assertionTextMap[kind][negate ? 1 : 0])
    }
    default:
      break
  }
  return null
}

export const getBackReferenceText = (
  node: AST.BackReferenceNode,
  t: TFunction,
) => `${t('Back reference')} #${node.ref}`

export const tryCharacterClassText = (key: string): [string, boolean] => {
  if (key === '') {
    return ['Empty', true]
  } else if (key in characterClassTextMap) {
    return [characterClassTextMap[key as CharacterClassKey], true]
  } else {
    return [`"${key}"`, false]
  }
}

export const getBoundaryAssertionText = (
  node:
    | AST.BeginningBoundaryAssertionNode
    | AST.EndBoundaryAssertionNode
    | AST.WordBoundaryAssertionNode,
  t: TFunction,
) => {
  let text = ''
  if (node.kind === 'word') {
    const negate = node.negate
    text = assertionTextMap.word[negate ? 1 : 0]
  } else {
    const kind = node.kind
    text = assertionTextMap[kind]
  }
  return t(text)
}

export const useSize = (
  node: AST.Node | AST.Node[],
  sizeMap: Map<AST.Node | AST.Node[], NodeSize>,
) => useMemo(() => sizeMap.get(node) || DEFAULT_SIZE, [node, sizeMap])

export const getQuantifierText = (quantifier: AST.Quantifier): string => {
  const { min, max } = quantifier
  const minText = min
  const maxText = max === Infinity ? '' : max
  if (min === max) {
    return ` ${minText}`
  }
  return ` ${minText} - ${maxText}`
}
