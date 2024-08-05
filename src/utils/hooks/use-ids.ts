import { nanoid } from 'nanoid'
import { useState } from 'react'

// Allowed operations:
// 1. insert a item at the end
// 2. remove a item at any position
export const useIds = (length: number) => {
  const [ids, setIds] = useState(() => Array.from({ length }, () => nanoid()))
  const removeId = (index: number) => {
    const newIds = [...ids]
    newIds.splice(index, 1)
    setIds(newIds)
  }
  const addId = () => {
    setIds([...ids, nanoid()])
  }
  return {
    ids,
    removeId,
    addId,
  }
}
