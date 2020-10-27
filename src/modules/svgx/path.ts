import SvgxElement from "./element"
class Path extends SvgxElement {
  constructor(container: SVGSVGElement | SVGGElement, pathString: string) {
    super()
    this.container = container
    this.target = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path"
    ) as SVGPathElement
    this.attr({
      d: pathString,
      stroke: "#000",
      fill: "none",
      "stroke-width": 1.5,
    })
    this.append()
  }
}
export default Path
