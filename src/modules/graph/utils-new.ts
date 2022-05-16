import LRUCache from "lru-cache"

const fontFamily = `-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji`
const lruCache = new LRUCache<string, [number, number]>({ max: 100 })
const canvas = document.createElement("canvas")

export const measureText = (text: string, fontSize = 16): [number, number] => {
  const textFont = fontSize + "px " + fontFamily
  const key = textFont + "-" + text
  if (lruCache.has(key)) {
    return lruCache.get(key)!
  }
  const context = canvas.getContext("2d")
  if (!context) {
    return [0, 0]
  }
  context.font = textFont
  const size: [number, number] = [
    context.measureText(text).width,
    fontSize * 1.5,
  ]
  lruCache.set(key, size)
  return size
}
