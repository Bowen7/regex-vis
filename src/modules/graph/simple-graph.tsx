import React from 'react'
import type { Atom } from 'jotai'
import { Provider } from 'jotai'
import { useHydrateAtoms } from 'jotai/utils'
import ASTGraph from './ast-graph'
import { isPrimaryGraphAtom, sizeMapAtom } from '@/atom'
import { parse } from '@/parser'

type Props = {
  regex: string
}

const initialValues: (readonly [Atom<unknown>, unknown])[] = [
  [sizeMapAtom, new Map()],
  [isPrimaryGraphAtom, false],
]

function HydrateAtoms({ initialValues, children }: { initialValues: any, children: React.ReactNode }) {
  // initialising on state with prop on render here
  useHydrateAtoms(initialValues)
  return children
}

const SimpleGraph = React.memo(({ regex }: Props) => {
  const ast = parse(regex)
  if (ast.type === 'error') {
    return null
  }
  return (
    <Provider>
      <HydrateAtoms initialValues={initialValues}>
        <ASTGraph ast={ast} />
      </HydrateAtoms>
    </Provider>
  )
})

export default SimpleGraph
