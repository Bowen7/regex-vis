type AttrMap = {
  d: string
  cx: number
  cy: number
  r: number
  x: number
  y: number
  rx: number
  ry: number
  dx: number
  dy: number
  width: number
  height: number
  stroke: string
  fill: string
  text: string
  "font-size": number
  style: string
  src: string
  "text-anchor": string
  "stroke-width": number
  "stroke-dasharray": string
  "pointer-events": string
}
export type Attr = Partial<AttrMap>
type AttrKey = keyof AttrMap
type ElementType = "rect" | "circle" | "path" | "text" | ""
class SvgxElement {
  container!: SVGSVGElement | SVGGElement
  target!: SVGElement
  events: Function[] = []
  type: ElementType = ""
  append() {
    this.container.appendChild(this.target)
  }
  remove() {
    this.container.removeChild(this.target)
  }
  attr(attrs: Attr) {
    for (let name in attrs) {
      switch (name) {
        case "text":
          while (this.target.firstChild) {
            this.target.removeChild(this.target.firstChild)
          }
          this.target.appendChild(
            document.createTextNode(attrs[name] as string)
          )
          break
        case "font-size":
          if (this.type === "text") {
            this.target.setAttribute(
              "dy",
              0.35 * (attrs["font-size"] as number) + ""
            )
          }
          this.target.setAttribute(name, attrs[name as AttrKey] + "")
          break
        case "src":
          this.target.setAttributeNS(
            "http://www.w3.org/1999/xlink",
            "xlink:href",
            attrs[name as AttrKey] + ""
          )
          break
        default:
          this.target.setAttribute(name, attrs[name as AttrKey] + "")
          break
      }
    }
    return this
  }
  getBBox() {
    return (this.target as SVGGraphicsElement).getBBox()
  }
  click(handler: (e: MouseEvent) => void) {
    this.target.addEventListener("click", handler)
    return () => this.target.removeEventListener("click", handler)
  }
}
export default SvgxElement
