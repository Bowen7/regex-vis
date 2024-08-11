import { expect, it, vi } from 'vitest'
import { act } from 'react'
import { renderHook } from '@testing-library/react'
import { useAtom, useSetAtom } from 'jotai'
import { nanoid } from 'nanoid'
import { updateQuantifierAtom } from '../quantifier'
import { astAtom, selectedIdsAtom } from '../atoms'
import type { AST } from '@/parser'

vi.mock('nanoid')

it('update quantifier', async () => {
  const { result: astAtomRef } = renderHook(() => useAtom(astAtom))
  const { result: selectedIdsAtomRef } = renderHook(() =>
    useAtom(selectedIdsAtom),
  )
  const { result: setUpdateQuantifierAtom } = renderHook(() =>
    useSetAtom(updateQuantifierAtom),
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
          value: 'f',
          quantifier: null,
        },
      ],
      flags: [],
      literal: true,
      escapeBackslash: false,
    })

    selectedIdsAtomRef.current[1](['2'])
  })

  act(() => {
    setUpdateQuantifierAtom.current({
      kind: '+',
      min: 1,
      max: Infinity,
      greedy: false,
    })
  })

  const expected: AST.Regex = {
    id: '1',
    type: 'regex',
    body: [
      {
        id: '2',
        type: 'character',
        kind: 'string',
        value: 'f',
        quantifier: {
          kind: '+',
          min: 1,
          max: Infinity,
          greedy: false,
        },
      },
    ],
    flags: [],
    literal: true,
    escapeBackslash: false,
  }
  expect(astAtomRef.current[0]).toEqual(expected)
})

it('add quantifier when string node value.length > 1', async () => {
  const { result: astAtomRef } = renderHook(() => useAtom(astAtom))
  const { result: selectedIdsAtomRef } = renderHook(() =>
    useAtom(selectedIdsAtom),
  )
  const { result: setUpdateQuantifierAtom } = renderHook(() =>
    useSetAtom(updateQuantifierAtom),
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
    setUpdateQuantifierAtom.current({
      kind: '+',
      min: 1,
      max: Infinity,
      greedy: false,
    })
  })

  const expected: AST.Regex = {
    id: '1',
    type: 'regex',
    body: [
      {
        id: '3',
        type: 'group',
        kind: 'nonCapturing',
        quantifier: {
          kind: '+',
          min: 1,
          max: Infinity,
          greedy: false,
        },
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
})

it('remove quantifier', async () => {
  const { result: astAtomRef } = renderHook(() => useAtom(astAtom))
  const { result: selectedIdsAtomRef } = renderHook(() =>
    useAtom(selectedIdsAtom),
  )
  const { result: setUpdateQuantifierAtom } = renderHook(() =>
    useSetAtom(updateQuantifierAtom),
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
          value: 'f',
          quantifier: {
            kind: '+',
            min: 1,
            max: Infinity,
            greedy: false,
          },
        },
      ],
      flags: [],
      literal: true,
      escapeBackslash: false,
    })

    selectedIdsAtomRef.current[1](['2'])
  })

  act(() => {
    setUpdateQuantifierAtom.current(null)
  })

  const expected: AST.Regex = {
    id: '1',
    type: 'regex',
    body: [
      {
        id: '2',
        type: 'character',
        kind: 'string',
        value: 'f',
        quantifier: null,
      },
    ],
    flags: [],
    literal: true,
    escapeBackslash: false,
  }
  expect(astAtomRef.current[0]).toEqual(expected)
})
