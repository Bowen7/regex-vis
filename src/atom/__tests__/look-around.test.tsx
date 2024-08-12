import { expect, it, vi } from 'vitest'
import { act } from 'react'
import { renderHook } from '@testing-library/react'
import { useAtom, useSetAtom } from 'jotai'
import { nanoid } from 'nanoid'
import { lookAroundSelectedAtom, updateLookAroundAtom } from '../look-around'
import { astAtom, selectedIdsAtom } from '../atoms'
import type { AST } from '@/parser'

vi.mock('nanoid')

it('look around assertion selected', async () => {
  const { result: astAtomRef } = renderHook(() => useAtom(astAtom))
  const { result: selectedIdsAtomRef } = renderHook(() =>
    useAtom(selectedIdsAtom),
  )
  const { result: setLookAroundSelectedRef } = renderHook(() =>
    useSetAtom(lookAroundSelectedAtom),
  )

  act(() => {
    astAtomRef.current[1]({
      id: '1',
      type: 'regex',
      body: [
        {
          id: '2',
          type: 'character',
          kind: 'string',
          value: 'foo',
          quantifier: null,
        },
      ],
      flags: [],
      literal: true,
      escapeBackslash: false,
    })

    selectedIdsAtomRef.current[1](['2'])
  })
  vi.mocked(nanoid).mockReturnValue('3')

  act(() => {
    setLookAroundSelectedRef.current('lookahead')
  })

  const expected: AST.Regex = {
    id: '1',
    type: 'regex',
    body: [
      {
        id: '3',
        type: 'lookAroundAssertion',
        kind: 'lookahead',
        negate: false,
        children: [
          {
            id: '2',
            type: 'character',
            kind: 'string',
            value: 'foo',
            quantifier: null,
          },
        ],
      },
    ],
    flags: [],
    literal: true,
    escapeBackslash: false,
  }
  expect(astAtomRef.current[0]).toEqual(expected)
  expect(selectedIdsAtomRef.current[0]).toEqual(['3'])
})

it('update look around assertion', async () => {
  const { result: astAtomRef } = renderHook(() => useAtom(astAtom))
  const { result: selectedIdsAtomRef } = renderHook(() =>
    useAtom(selectedIdsAtom),
  )
  const { result: setUpdateLookAroundAtom } = renderHook(() =>
    useSetAtom(updateLookAroundAtom),
  )

  act(() => {
    astAtomRef.current[1]({
      id: '1',
      type: 'regex',
      body: [
        {
          id: '3',
          type: 'lookAroundAssertion',
          kind: 'lookahead',
          negate: false,
          children: [
            {
              id: '2',
              type: 'character',
              kind: 'string',
              value: 'foo',
              quantifier: null,
            },
          ],
        },
      ],
      flags: [],
      literal: true,
      escapeBackslash: false,
    })

    selectedIdsAtomRef.current[1](['3'])
  })

  act(() => {
    setUpdateLookAroundAtom.current({ kind: 'lookbehind', negate: true })
  })

  const expected: AST.Regex = {
    id: '1',
    type: 'regex',
    body: [
      {
        id: '3',
        type: 'lookAroundAssertion',
        kind: 'lookbehind',
        negate: true,
        children: [
          {
            id: '2',
            type: 'character',
            kind: 'string',
            value: 'foo',
            quantifier: null,
          },
        ],
      },
    ],
    flags: [],
    literal: true,
    escapeBackslash: false,
  }
  expect(astAtomRef.current[0]).toEqual(expected)
  expect(selectedIdsAtomRef.current[0]).toEqual(['3'])
})

it('unLookAround', async () => {
  const { result: astAtomRef } = renderHook(() => useAtom(astAtom))
  const { result: selectedIdsAtomRef } = renderHook(() =>
    useAtom(selectedIdsAtom),
  )
  const { result: setUpdateLookAroundAtom } = renderHook(() =>
    useSetAtom(updateLookAroundAtom),
  )

  act(() => {
    astAtomRef.current[1]({
      id: '1',
      type: 'regex',
      body: [
        {
          id: '3',
          type: 'lookAroundAssertion',
          kind: 'lookahead',
          negate: false,
          children: [
            {
              id: '2',
              type: 'character',
              kind: 'string',
              value: 'foo',
              quantifier: null,
            },
          ],
        },
      ],
      flags: [],
      literal: true,
      escapeBackslash: false,
    })

    selectedIdsAtomRef.current[1](['3'])
  })

  act(() => {
    setUpdateLookAroundAtom.current(null)
  })

  const expected: AST.Regex = {
    id: '1',
    type: 'regex',
    body: [
      {
        id: '2',
        type: 'character',
        kind: 'string',
        value: 'foo',
        quantifier: null,
      },
    ],
    flags: [],
    literal: true,
    escapeBackslash: false,
  }
  expect(astAtomRef.current[0]).toEqual(expected)
  expect(selectedIdsAtomRef.current[0]).toEqual(['2'])
})
