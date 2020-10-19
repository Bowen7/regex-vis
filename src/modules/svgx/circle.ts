import SvgxBaseElement from "./element"
class Circle extends SvgxBaseElement {
  constructor(container: SVGSVGElement, x: number, y: number, radius: number) {
    super()
    this.container = container
    this.el = document.createElementNS(
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
