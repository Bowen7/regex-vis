import { renderHook, act } from "@testing-library/react"
import { useAtom, useSetAtom } from "jotai"
import { AST } from "@/parser"
import { removeAtom } from "../remove"
import { astAtom, selectedIdsAtom } from "../atoms"

test("remove selected", async () => {
  const { result: astAtomRef } = renderHook(() => useAtom(astAtom))
  const { result: selectedIdsAtomRef } = renderHook(() =>
    useAtom(selectedIdsAtom)
  )
  const { result: setRemoveAtom } = renderHook(() => useSetAtom(removeAtom))

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
      withSlash: true,
    })

    selectedIdsAtomRef.current[1](["2"])
  })

  act(() => {
    setRemoveAtom.current()
  })

  const expected: AST.Regex = {
    id: "1",
    type: "regex",
    body: [],
    flags: [],
    withSlash: true,
  }
  expect(astAtomRef.current[0]).toEqual(expected)
})

test("remove selected in a choice node", async () => {
  const { result: astAtomRef } = renderHook(() => useAtom(astAtom))
  const { result: selectedIdsAtomRef } = renderHook(() =>
    useAtom(selectedIdsAtom)
  )
  const { result: setRemoveAtom } = renderHook(() => useSetAtom(removeAtom))

  act(() => {
    astAtomRef.current[1]({
      id: "1",
      type: "regex",
      body: [
        {
          id: "2",
          type: "choice",
          branches: [
            [
              {
                id: "3",
                type: "character",
                kind: "string",
                value: "foo",
                quantifier: null,
              },
            ],
            [
              {
                id: "4",
                type: "character",
                kind: "string",
                value: "foo",
                quantifier: null,
              },
            ],
          ],
        },
      ],
      flags: [],
      withSlash: true,
    })

    selectedIdsAtomRef.current[1](["3"])
  })

  act(() => {
    setRemoveAtom.current()
  })

  const expected: AST.Regex = {
    id: "1",
    type: "regex",
    body: [
      {
        id: "4",
        type: "character",
        kind: "string",
        value: "foo",
        quantifier: null,
      },
    ],
    flags: [],
    withSlash: true,
  }
  expect(astAtomRef.current[0]).toEqual(expected)
})
