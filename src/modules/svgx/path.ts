import SvgxElement from "./element"
import { baseAttr } from "./config"
class Path extends SvgxElement {
  constructor(container: SVGSVGElement | SVGGElement, pathString: string) {
    super()
    this.container = container
    this.target = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path"
    ) as SVGPathElement
    this.attr({ d: pathString, ...baseAttr })
    this.append()
  }
}
export default Path
