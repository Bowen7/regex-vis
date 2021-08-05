import { useState } from "react"
const prefix = "use-storage-state-"
const useStorageState = <T>(
  key: string,
  initialState: T
): [T, (nextState: T) => void] => {
  const [state, setState] = useState(() => {
    const value = localStorage.getItem(prefix + key)
    if (value) {
      return JSON.parse(value)
    }
    return initialState
  })
  return [
    state,
    (nextState: T) => {
      localStorage.setItem(prefix + key, JSON.stringify(nextState))
      setState(nextState)
    },
  ]
}
export default useStorageState
