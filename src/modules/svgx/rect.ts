import SvgxElement from "./element"
class Rect extends SvgxElement {
  constructor(
    container: SVGSVGElement | SVGGElement,
    x: number,
    y: number,
    width: number,
    height: number,
    r?: number
  ) {
    super()
    this.container = container
    this.target = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "rect"
    ) as SVGRectElement
    r = r ? r : 0
    this.attr({
      x,
      y,
      width,
      height,
      rx: r,
      ry: r,
      stroke: "#000",
      fill: "#fff",
      "stroke-width": 1.5,
    })
    this.append()
  }
}
export default Rect
