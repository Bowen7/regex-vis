import SvgxElement from "./element"
import { baseAttr } from "./config"
class Rect extends SvgxElement {
  constructor(
    container: SVGSVGElement | SVGGElement,
    x: number,
    y: number,
    width: number,
    height: number,
    r: number
  ) {
    super()
    this.container = container
    this.target = document.createElementNS(
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
