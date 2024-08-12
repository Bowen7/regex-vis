import { expect, it } from 'vitest'
import parse from '../parse'
import type * as AST from '../ast'

it('parse should return error when receiving invalid flags', () => {
  const expected = {
    type: 'error',
    message: `Invalid flags supplied to RegExp constructor 'z'`,
  }
  const result = parse('/(?:)/z', { idGenerator: () => '' })
  expect(result).toEqual(expected)
})

it('parse should return correct ast when receiving flags', () => {
  const expected: AST.Regex = {
    id: '',
    type: 'regex',
    body: [
      {
        id: '',
        type: 'group',
        kind: 'nonCapturing',
        children: [],
        quantifier: null,
      },
    ],
    flags: ['g'],
    literal: true,
    escapeBackslash: false,
  }
  const result = parse('/(?:)/g', { idGenerator: () => '' })
  expect(result).toEqual(expected)
})
