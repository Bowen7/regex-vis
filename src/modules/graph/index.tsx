import React from 'react'
import { useSetAtom } from 'jotai'
import { ExclamationTriangleIcon } from '@radix-ui/react-icons'
import ASTGraph from './ast-graph'
import type { AST } from '@/parser'
import { selectNodesByBoxAtom } from '@/atom'
import { useDragSelect } from '@/utils/hooks'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

interface Props {
  regex: string
  ast: AST.Regex
  errorMsg?: string | null
}

const Graph: React.FC<Props> = ({ ast, errorMsg = null }) => {
  const selectNodesByBox = useSetAtom(selectNodesByBoxAtom)

  const [bindings, Selection] = useDragSelect({
    disabled: !!errorMsg,
    className: 'rounded bg-blue-500/50 border border-blue-500',
    onSelect: box => selectNodesByBox(box),
  })

  return (
    <div className="relative inline-block" {...bindings}>
      {errorMsg
        ? (
            <Alert>
              <ExclamationTriangleIcon className="h-6 w-6" />
              <AlertTitle className="!pl-10">Error</AlertTitle>
              <AlertDescription className="!pl-10">
                {errorMsg}
              </AlertDescription>
            </Alert>
          )
        : (
            <>
              {ast.body.length > 0 && <ASTGraph ast={ast} />}
              {Selection}
            </>
          )}
    </div>
  )
}

export default Graph
