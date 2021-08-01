import { useEffect, useRef } from "react"

const useUpdateEffect: typeof useEffect = (effect, deps) => {
  const firstMount = useRef(true)

  useEffect(() => {
    if (!firstMount.current) {
      return effect()
    } else {
      firstMount.current = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}

export default useUpdateEffect
