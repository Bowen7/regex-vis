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
    MutableRefObject<boolean>,
    Dispatch<SetStateAction<T>>
  >()
  private _current: T
  constructor(initialState: T) {
    store.set(this.key, initialState)
    this._current = initialState
  }

  subscribe(
    ref: MutableRefObject<boolean>,
    action: Dispatch<SetStateAction<T>>
  ) {
    this.subscribers.set(ref, action)
  }

  unsubscribe(ref: MutableRefObject<boolean>) {
    this.subscribers.delete(ref)
  }

  setState(nextState: T) {
    this._current = nextState
    store.set(this.key, nextState)
    this.subscribers.forEach((action) => action.call(null, nextState))
  }

  get current() {
    return this._current
  }
}

export const atom = <T>(initialState: T) => new Atom(initialState)

export const useAtomValue = <T>(atom: Atom<T>) => {
  const ref = useRef(false)
  const [state, setState] = useState(atom.current)

  if (ref.current === false) {
    ref.current = true
    atom.subscribe(ref, setState)
  }
  useEffect(
    () => () => atom.unsubscribe(ref),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )
  return state
}

export const setAtomValue =
  <T>(atom: Atom<T>) =>
  (nextState: T) =>
    atom.setState(nextState)
