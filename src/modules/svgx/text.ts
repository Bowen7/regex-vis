import SvgxBaseElement from "./element"
import { baseTextAttr } from "./config"
class Text extends SvgxBaseElement {
  constructor(container: SVGSVGElement, x: number, y: number, text: string) {
    super()
    this.type = "text"
    this.container = container
    this.el = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "text"
    ) as SVGTextElement
    this.attr({
      x,
      y,
      text,
      ...baseTextAttr,
      dy: baseTextAttr["font-size"] * 0.35,
    })
    this.append()
  }
}
export default Text
