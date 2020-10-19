import SvgxBaseElement from "./element"
import { baseAttr } from "./config"
class Rect extends SvgxBaseElement {
  constructor(
    container: SVGSVGElement,
    x: number,
    y: number,
    width: number,
    height: number,
    r: number
  ) {
    super()
    this.container = container
    this.el = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "rect"
    ) as SVGRectElement
    this.attr({
      x,
      y,
      width,
      height,
      rx: r,
      ry: r,
      ...baseAttr,
    })
    this.append()
  }
}
export default Rect
