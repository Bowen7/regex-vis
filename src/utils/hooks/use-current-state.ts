// MIT License

// Copyright (c) 2020 Geist UI

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.
import {
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react"

export type CurrentStateType<S> = [
  S,
  Dispatch<SetStateAction<S>>,
  MutableRefObject<S>
]

export const useCurrentState = <S>(
  initialState: S | (() => S)
): CurrentStateType<S> => {
  const [state, setState] = useState<S>(() => {
    return typeof initialState === "function"
      ? (initialState as () => S)()
      : initialState
  })
  const ref = useRef<S>(initialState as S)

  useEffect(() => {
    ref.current = state
  }, [state])

  const setValue = useCallback((val: SetStateAction<S>) => {
    const result =
      typeof val === "function"
        ? (val as (prevState: S) => S)(ref.current)
        : val
    ref.current = result
    setState(result)
  }, [])

  return [state, setValue, ref]
}
