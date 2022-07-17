import { renderHook, act } from "@testing-library/react"
import { useAtom, useSetAtom } from "jotai"
import * as nanoid from "nanoid"
import { AST } from "@/parser"
import { insertAtom } from "../insert"
import { astAtom, selectedIdsAtom } from "../atoms"
jest.mock("nanoid")

test("insert prev", async () => {
  const { result: astAtomRef } = renderHook(() => useAtom(astAtom))
  const { result: selectedIdsAtomRef } = renderHook(() =>
    useAtom(selectedIdsAtom)
  )
  const { result: setInsertRef } = renderHook(() => useSetAtom(insertAtom))

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
    setInsertRef.current("prev")
  })

  const expected: AST.Regex = {
    id: "1",
    type: "regex",
    body: [
      {
        id: "3",
        type: "character",
        kind: "string",
        value: "",
        quantifier: null,
      },
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

test("insert next", async () => {
  const { result: astAtomRef } = renderHook(() => useAtom(astAtom))
  const { result: selectedIdsAtomRef } = renderHook(() =>
    useAtom(selectedIdsAtom)
  )
  const { result: setInsertRef } = renderHook(() => useSetAtom(insertAtom))

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
    setInsertRef.current("next")
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
      {
        id: "3",
        type: "character",
        kind: "string",
        value: "",
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

test("insert as branch", async () => {
  const { result: astAtomRef } = renderHook(() => useAtom(astAtom))
  const { result: selectedIdsAtomRef } = renderHook(() =>
    useAtom(selectedIdsAtom)
  )
  const { result: setInsertRef } = renderHook(() => useSetAtom(insertAtom))

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
  ;(nanoid.nanoid as jest.Mock)
    .mockReturnValueOnce("3")
    .mockReturnValueOnce("4")

  act(() => {
    setInsertRef.current("branch")
  })

  const expected: AST.Regex = {
    id: "1",
    type: "regex",
    body: [
      {
        id: "4",
        type: "choice",
        branches: [
          [
            {
              id: "2",
              type: "character",
              kind: "string",
              value: "foo",
              quantifier: null,
            },
          ],
          [
            {
              id: "3",
              type: "character",
              kind: "string",
              value: "",
              quantifier: null,
            },
          ],
        ],
      },
    ],
    flags: [],
    literal: true,
    escapeBackslash: false,
  }
  expect(astAtomRef.current[0]).toEqual(expected)
  expect(selectedIdsAtomRef.current[0]).toEqual(["2"])
})
