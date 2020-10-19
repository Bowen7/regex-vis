type AttrMap = {
  d?: string
  cx?: number
  cy?: number
  r?: number
  x?: number
  y?: number
  rx?: number
  ry?: number
  dx?: number
  dy?: number
  width?: number
  height?: number
  stroke?: string
  fill?: string
  text?: string
  "font-size"?: number
  style?: string
}
type AttrKey = keyof AttrMap
type ElementType = "rect" | "circle" | "path" | "text" | ""
class SvgxBaseElement {
  container: SVGSVGElement | null = null
  el: SVGElement | null = null
  events: Function[] = []
  type: ElementType = ""
  append() {
    if (this.container && this.el) {
      this.container.appendChild(this.el)
    }
  }
  remove() {
    if (this.container && this.el) {
      this.container.removeChild(this.el)
    }
  }
  attr(attrs: AttrMap) {
    if (!this.el) {
      return this
    }
    for (let name in attrs) {
      switch (name) {
        case "text":
          while (this.el.firstChild) {
            this.el.removeChild(this.el.firstChild)
          }
          // const tspan = document.createElementNS(
          //   "http://www.w3.org/2000/svg",
          //   "tspan"
          // ) as SVGTSpanElement
          this.el.appendChild(document.createTextNode(attrs[name] as string))
          break
        case "font-size":
          if (this.type === "text") {
            this.el.setAttribute(
              "dy",
              0.35 * (attrs["font-size"] as number) + ""
            )
          }
          this.el.setAttribute(name, attrs[name as AttrKey] + "")
          break
        default:
          this.el.setAttribute(name, attrs[name as AttrKey] + "")
          break
      }
    }
    return this
  }
  getBBox() {
    return (this.el as SVGGraphicsElement).getBBox()
  }
}
export default SvgxBaseElement
