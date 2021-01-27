import { useEffect, useRef } from 'react'

export function useEventListener(
  eventName: string,
  handler: (e: Event) => void,
  element: HTMLElement | Window = window
) {
  const savedHandler = useRef<(e: Event) => void>()
  useEffect(() => {
    savedHandler.current = handler
  }, [handler])

  useEffect(() => {
    const isSupported = element && element.addEventListener
    if (!isSupported) return

    const eventListener = (event: Event) => savedHandler.current!(event)

    element.addEventListener(eventName, eventListener)

    return () => {
      element.removeEventListener(eventName, eventListener)
    }
  }, [eventName, element])
}
