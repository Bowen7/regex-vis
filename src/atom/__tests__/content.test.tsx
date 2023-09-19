import { renderHook, act } from "@testing-library/react"
import { useAtom, useSetAtom } from "jotai"
import * as nanoid from "nanoid"
import { AST } from "@/parser"
import { astAtom, selectedIdsAtom } from "../atoms"
import { updateContentAtom } from "../content"
jest.mock("nanoid")

test("update content", async () => {
  const { result: astAtomRef } = renderHook(() => useAtom(astAtom))
  const { result: setUpdateContentAtom } = renderHook(() =>
    useSetAtom(updateContentAtom)
  )
  const { result: setSelectedIdsRef } = renderHook(() =>
    useSetAtom(selectedIdsAtom)
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
    setSelectedIdsRef.current(["2"])
  })

  act(() => {
    setUpdateContentAtom.current({
      kind: "ranges",
      ranges: [{ from: "a", to: "z" }],
      negate: false,
    })
  })

  const expected: AST.Regex = {
    id: "1",
    type: "regex",
    body: [
      {
        id: "2",
        type: "character",
        kind: "ranges",
        ranges: [{ from: "a", to: "z" }],
        negate: false,
        quantifier: null,
      },
    ],
    flags: [],
    literal: true,
    escapeBackslash: false,
  }

  expect(astAtomRef.current[0]).toEqual(expected)
})

test("update a string node which has quantifier", async () => {
  const { result: astAtomRef } = renderHook(() => useAtom(astAtom))
  const { result: setUpdateContentAtom } = renderHook(() =>
    useSetAtom(updateContentAtom)
  )
  const { result: setSelectedIdsRef } = renderHook(() =>
    useSetAtom(selectedIdsAtom)
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
          value: "f",
          quantifier: {
            kind: "custom",
            min: 2,
            max: 5,
            greedy: false,
          },
        },
      ],
      flags: [],
      literal: true,
      escapeBackslash: false,
    })
    setSelectedIdsRef.current(["2"])
  })
  ;(nanoid.nanoid as jest.Mock).mockReturnValue("3")

  act(() => {
    setUpdateContentAtom.current({
      kind: "string",
      value: "fff",
    })
  })

  const expected: AST.Regex = {
    id: "1",
    type: "regex",
    body: [
      {
        id: "3",
        type: "group",
        kind: "nonCapturing",
        children: [
          {
            id: "2",
            type: "character",
            kind: "string",
            value: "fff",
            quantifier: null,
          },
        ],
        quantifier: {
          kind: "custom",
          min: 2,
          max: 5,
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
