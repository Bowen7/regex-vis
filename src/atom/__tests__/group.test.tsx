import { expect, it, vi } from 'vitest'
import { act } from 'react'
import { renderHook } from '@testing-library/react'
import { useAtom, useSetAtom } from 'jotai'
import { nanoid } from 'nanoid'
import { groupSelectedAtom, updateGroupAtom } from '../group'
import { astAtom, selectedIdsAtom } from '../atoms'
import type { AST } from '@/parser'

vi.mock('nanoid')

it('group selected', async () => {
  const { result: astAtomRef } = renderHook(() => useAtom(astAtom))
  const { result: selectedIdsAtomRef } = renderHook(() =>
    useAtom(selectedIdsAtom),
  )
  const { result: setGroupSelectedRef } = renderHook(() =>
    useSetAtom(groupSelectedAtom),
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
    setGroupSelectedRef.current({ kind: 'capturing', index: 0, name: '0' })
  })

  const expected: AST.Regex = {
    id: '1',
    type: 'regex',
    body: [
      {
        id: '3',
        type: 'group',
        kind: 'capturing',
        index: 1,
        name: '1',
        quantifier: null,
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

it('update group', async () => {
  const { result: astAtomRef } = renderHook(() => useAtom(astAtom))
  const { result: selectedIdsAtomRef } = renderHook(() =>
    useAtom(selectedIdsAtom),
  )
  const { result: setUpdateGroupRef } = renderHook(() =>
    useSetAtom(updateGroupAtom),
  )

  act(() => {
    astAtomRef.current[1]({
      id: '1',
      type: 'regex',
      body: [
        {
          id: '3',
          type: 'group',
          kind: 'capturing',
          index: 1,
          name: '1',
          quantifier: null,
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
    setUpdateGroupRef.current({ kind: 'nonCapturing' })
  })

  const expected: AST.Regex = {
    id: '1',
    type: 'regex',
    body: [
      {
        id: '3',
        type: 'group',
        kind: 'nonCapturing',
        quantifier: null,
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

it('unGroup', async () => {
  const { result: astAtomRef } = renderHook(() => useAtom(astAtom))
  const { result: selectedIdsAtomRef } = renderHook(() =>
    useAtom(selectedIdsAtom),
  )
  const { result: setUpdateGroupRef } = renderHook(() =>
    useSetAtom(updateGroupAtom),
  )

  act(() => {
    astAtomRef.current[1]({
      id: '1',
      type: 'regex',
      body: [
        {
          id: '3',
          type: 'group',
          kind: 'capturing',
          index: 1,
          name: '1',
          quantifier: null,
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
    setUpdateGroupRef.current(null)
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
