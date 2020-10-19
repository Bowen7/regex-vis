import Path from "./path"
import Rect from "./rect"
import Circle from "./circle"
import Text from "./text"
class Svgx {
  svgDOM: SVGSVGElement
  constructor(query: string) {
    this.svgDOM = document.querySelector(query) as SVGSVGElement
  }
  setSize(width: number, height: number) {
    this.svgDOM.setAttribute("width", width.toString())
    this.svgDOM.setAttribute("height", height.toString())
  }
  text(x: number, y: number, text: string) {
    return new Text(this.svgDOM, x, y, text)
  }
  rect(x: number, y: number, width: number, height: number, r: number) {
    return new Rect(this.svgDOM, x, y, width, height, r)
  }
  path(pathString: string) {
    return new Path(this.svgDOM, pathString)
  }
  circle(cx: number, cy: number, r: number) {
    return new Circle(this.svgDOM, cx, cx, r)
  }
}
export default Svgx
