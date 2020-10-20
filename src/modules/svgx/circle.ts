import SvgxElement from "./element"
class Circle extends SvgxElement {
  constructor(
    container: SVGSVGElement | SVGGElement,
    x: number,
    y: number,
    radius: number
  ) {
    super()
    this.container = container
    this.target = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "circle"
    ) as SVGCircleElement
    this.attr({
      cx: x,
      cy: y,
      r: radius,
    })
    this.append()
  }
}
export default Circle
