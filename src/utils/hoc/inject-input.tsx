import React from "react"
type InjectedProps = {
  onKeyDown?: (e: React.KeyboardEvent) => void
}
function injectInput<T extends InjectedProps = InjectedProps>(
  Input: React.ComponentType<T & InjectedProps>
) {
  const InjectedInput = (props: Omit<T, keyof InjectedProps>) => {
    const handleKeyDown = (e: React.KeyboardEvent) => {
      const metaKey = e.ctrlKey || e.metaKey
      if (metaKey && e.key === "z") {
        e.preventDefault()
        return
      }
      e.stopPropagation()
    }
    return <Input onKeyDown={handleKeyDown} {...(props as T)} />
  }
  return InjectedInput
}
export default injectInput
