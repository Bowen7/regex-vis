import SvgxElement from "./element"
class Text extends SvgxElement {
  constructor(
    container: SVGSVGElement | SVGGElement,
    x: number,
    y: number,
    text: string
  ) {
    super()
    this.type = "text"
    this.container = container
    this.target = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "text"
    ) as SVGTextElement
    this.attr({
      x,
      y,
      text,
      "text-anchor": "middle",
      "font-size": 16,
      dy: 16 * 0.35,
      "pointer-events": "none",
    })
    this.append()
  }
}
export default Text
