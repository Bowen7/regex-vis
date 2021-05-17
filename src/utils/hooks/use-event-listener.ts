import { useEffect, useRef } from "react"

export default function useEventListener(
  eventName: string,
  handler: (e: Event) => void,
  element: HTMLElement | Window | null = null
) {
  if (typeof window !== "undefined") {
    element = window
  }
  const savedHandler = useRef<(e: Event) => void>()
  useEffect(() => {
    savedHandler.current = handler
  }, [handler])

  useEffect(() => {
    if (!element) return

    const eventListener = (event: Event) => savedHandler.current!(event)

    element.addEventListener(eventName, eventListener)

    return () => {
      element!.removeEventListener(eventName, eventListener)
    }
  }, [eventName, element])
}
