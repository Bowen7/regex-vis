import React, { useState } from 'react'
import { Input, Button } from '@geist-ui/react'
import Repeat from '@geist-ui/react-icons/repeat'
import { Node } from '@/types'
import Editor from '../editor'
import { remove, insert, group } from '../../parser/utils'
import Railroad from '../railroad'
import parser from '@/parser'
const DEFAULT_REGEX = `/[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\\.[a-zA-Z0-9_-]+)+(a|b)/`
// const DEFAULT_REGEX = `/([.]{1,33333})(aa)/`
// const DEFAULT_REGEX = `/a/`
const Home: React.FC<{}> = () => {
  const [regex, setRegex] = useState<string>(DEFAULT_REGEX)
  const [nodes, setNodes] = useState<Node[]>(parser.parse(DEFAULT_REGEX))
  const [selectedNodes, setSelectedNodes] = useState<Node[]>([])

  function handleRegexChange(e: React.ChangeEvent<HTMLInputElement>) {
    setRegex(e.target.value)
  }
  function handleRenderClick() {
    const nodes = parser.parse(regex)
    setNodes(nodes)
  }
  function onRemove() {
    if (selectedNodes.length > 0) {
      setNodes(remove(nodes, selectedNodes))
    }
    onSelect([])
  }
  function onSelect(nodes: Node[]) {
    setSelectedNodes(nodes)
  }
  function onInsert(direction: 'prev' | 'next' | 'parallel') {
    setNodes(insert(nodes, selectedNodes, direction))
  }
  function onGroup(type: string, name: string) {
    // group(root.r, selectedNodes, type as GroupKind | "nonGroup", name)
    // setRoot(root.r)
  }
  function onKeyDown(e: React.KeyboardEvent) {
    e.stopPropagation()
  }
  return (
    <>
      <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
        <Railroad
          nodes={nodes}
          onSelect={onSelect}
          selectedNodes={selectedNodes}
        />
      </div>

      <Editor
        nodes={selectedNodes}
        onInsert={onInsert}
        onRemove={onRemove}
        onGroup={onGroup}
      />

      <div
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {/* <Repeat transform="rotate(90)" /> */}
      </div>
      <div
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Input
          placeholder="输入正则"
          width="500px"
          value={regex}
          onChange={handleRegexChange}
          onKeyDown={onKeyDown}
        />
        <Button
          auto
          style={{
            marginLeft: '20px',
          }}
          onClick={handleRenderClick}
        >
          Render
        </Button>
      </div>
    </>
  )
}

export default Home
