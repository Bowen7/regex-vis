import React, { useEffect, useState } from "react"
import ReactDom from "react-dom"
const portalRoot = document.getElementById("portal")
const Portal: React.FC<{}> = props => {
  const [container] = useState<Element>(document.createElement("div"))
  useEffect(() => {
    portalRoot?.appendChild(container)
    return () => {
      portalRoot?.removeChild(container)
    }
  }, [container])
  return ReactDom.createPortal(props.children, container)
}

export default Portal
