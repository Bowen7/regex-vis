import { renderHook, act } from "@testing-library/react"
import { useAtom, useSetAtom } from "jotai"
import * as nanoid from "nanoid"
import { AST } from "@/parser"
import { updateGroupAtom, groupSelectedAtom } from "../group"
import { astAtom, selectedIdsAtom } from "../atoms"
jest.mock("nanoid")

test("group selected", async () => {
  const { result: astAtomRef } = renderHook(() => useAtom(astAtom))
  const { result: selectedIdsAtomRef } = renderHook(() =>
    useAtom(selectedIdsAtom)
  )
  const { result: setGroupSelectedRef } = renderHook(() =>
    useSetAtom(groupSelectedAtom)
  )

  act(() => {
    astAtomRef.current[1]({
      id: "1",
      type: "regex",
      body: [
        {
          id: "2",
          type: "character",
          kind: "string",
          value: "foo",
          quantifier: null,
        },
      ],
      flags: [],
      literal: true,
      escapeBackslash: false,
    })

    selectedIdsAtomRef.current[1](["2"])
  })
  ;(nanoid.nanoid as jest.Mock).mockReturnValue("3")

  act(() => {
    setGroupSelectedRef.current({ kind: "capturing", index: 0, name: "0" })
  })

  const expected: AST.Regex = {
    id: "1",
    type: "regex",
    body: [
      {
        id: "3",
        type: "group",
        kind: "capturing",
        index: 1,
        name: "1",
        quantifier: null,
        children: [
          {
            id: "2",
            type: "character",
            kind: "string",
            value: "foo",
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
  expect(selectedIdsAtomRef.current[0]).toEqual(["3"])
})

test("update group", async () => {
  const { result: astAtomRef } = renderHook(() => useAtom(astAtom))
  const { result: selectedIdsAtomRef } = renderHook(() =>
    useAtom(selectedIdsAtom)
  )
  const { result: setUpdateGroupRef } = renderHook(() =>
    useSetAtom(updateGroupAtom)
  )

  act(() => {
    astAtomRef.current[1]({
      id: "1",
      type: "regex",
      body: [
        {
          id: "3",
          type: "group",
          kind: "capturing",
          index: 1,
          name: "1",
          quantifier: null,
          children: [
            {
              id: "2",
              type: "character",
              kind: "string",
              value: "foo",
              quantifier: null,
            },
          ],
        },
      ],
      flags: [],
      literal: true,
      escapeBackslash: false,
    })

    selectedIdsAtomRef.current[1](["3"])
  })

  act(() => {
    setUpdateGroupRef.current({ kind: "nonCapturing" })
  })

  const expected: AST.Regex = {
    id: "1",
    type: "regex",
    body: [
      {
        id: "3",
        type: "group",
        kind: "nonCapturing",
        quantifier: null,
        children: [
          {
            id: "2",
            type: "character",
            kind: "string",
            value: "foo",
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
  expect(selectedIdsAtomRef.current[0]).toEqual(["3"])
})

test("unGroup", async () => {
  const { result: astAtomRef } = renderHook(() => useAtom(astAtom))
  const { result: selectedIdsAtomRef } = renderHook(() =>
    useAtom(selectedIdsAtom)
  )
  const { result: setUpdateGroupRef } = renderHook(() =>
    useSetAtom(updateGroupAtom)
  )

  act(() => {
    astAtomRef.current[1]({
      id: "1",
      type: "regex",
      body: [
        {
          id: "3",
          type: "group",
          kind: "capturing",
          index: 1,
          name: "1",
          quantifier: null,
          children: [
            {
              id: "2",
              type: "character",
              kind: "string",
              value: "foo",
              quantifier: null,
            },
          ],
        },
      ],
      flags: [],
      literal: true,
      escapeBackslash: false,
    })

    selectedIdsAtomRef.current[1](["3"])
  })

  act(() => {
    setUpdateGroupRef.current(null)
  })

  const expected: AST.Regex = {
    id: "1",
    type: "regex",
    body: [
      {
        id: "2",
        type: "character",
        kind: "string",
        value: "foo",
        quantifier: null,
      },
    ],
    flags: [],
    literal: true,
    escapeBackslash: false,
  }
  expect(astAtomRef.current[0]).toEqual(expected)
  expect(selectedIdsAtomRef.current[0]).toEqual(["2"])
})
