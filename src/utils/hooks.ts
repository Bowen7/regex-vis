import { useEffect, useRef } from "react"

// handle global event
export function useEventListener(
  eventName: string,
  handler: (e: Event) => void
) {
  const _handler = useRef<(e: Event) => void>()
  useEffect(() => {
    _handler.current = handler
  }, [handler])
  useEffect(() => {
    const eventListener = (e: Event) => _handler.current && _handler.current(e)
    global.addEventListener(eventName, eventListener)
  }, [eventName])
}
