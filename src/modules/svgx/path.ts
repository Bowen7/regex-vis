import SvgxBaseElement from "./element"
import { baseAttr } from "./config"
class Path extends SvgxBaseElement {
  constructor(container: SVGSVGElement, pathString: string) {
    super()
    this.container = container
    this.el = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path"
    ) as SVGPathElement
    this.attr({ d: pathString, ...baseAttr })
    this.append()
  }
}
export default Path
