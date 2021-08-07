import {
  useRef,
  useEffect,
  MutableRefObject,
  Dispatch,
  SetStateAction,
  useState,
} from "react"
import { nanoid } from "nanoid"
const store = new Map<string, any>()

class Atom<T> {
  key = nanoid()
  subscribers = new Map<
    MutableRefObject<undefined>,
    Dispatch<SetStateAction<T>>
  >()
  current: T
  constructor(initialState: T) {
    store.set(this.key, initialState)
    this.current = initialState
  }

  subscribe(
    ref: MutableRefObject<undefined>,
    action: Dispatch<SetStateAction<T>>
  ) {
    this.subscribers.set(ref, action)
  }

  unsubscribe(ref: MutableRefObject<undefined>) {
    this.subscribers.delete(ref)
  }

  setState(nextState: T) {
    this.current = nextState
    store.set(this.key, nextState)
    this.subscribers.forEach((action) => action.call(null, nextState))
  }
}

export const atom = <T>(initialState: T) => new Atom(initialState)

export const useAtomValue = <T>(atom: Atom<T>) => {
  const ref = useRef()
  const [state, setState] = useState(atom.current)

  useEffect(() => {
    atom.subscribe(ref, setState)
    return () => atom.unsubscribe(ref)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return state
}

export const setAtomValue =
  <T>(atom: Atom<T>) =>
  (nextState: T) =>
    atom.setState(nextState)
