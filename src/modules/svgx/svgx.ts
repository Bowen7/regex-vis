import Path from "./path"
import Rect from "./rect"
import Circle from "./circle"
import Text from "./text"
import Image from "./image"

class BaseSvgx {
  target!: SVGSVGElement | SVGGElement
  text(x: number, y: number, text: string) {
    return new Text(this.target, x, y, text)
  }
  rect(x: number, y: number, width: number, height: number, r?: number) {
    return new Rect(this.target, x, y, width, height, r)
  }
  path(pathString: string) {
    return new Path(this.target, pathString)
  }
  circle(cx: number, cy: number, r: number) {
    return new Circle(this.target, cx, cx, r)
  }
  image(src: string, x: number, y: number, width: number, height: number) {
    return new Image(this.target, src, x, y, width, height)
  }
}

export class G extends BaseSvgx {
  target: SVGGElement
  svgDOM: SVGSVGElement
  constructor(svgDOM: SVGSVGElement) {
    super()
    this.svgDOM = svgDOM
    this.target = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "g"
    ) as SVGGElement
    this.svgDOM.appendChild(this.target)
  }
  remove() {
    this.svgDOM.removeChild(this.target)
  }
  enter(handler: (e: MouseEvent) => void) {
    this.target.addEventListener("mouseenter", handler)
    return () => {
      this.target.removeEventListener("mouseenter", handler)
    }
  }
  leave(handler: (e: MouseEvent) => void) {
    this.target.addEventListener("mouseleave", handler)
    return () => {
      this.target.removeEventListener("mouseleave", handler)
    }
  }
  click(handler: (e: MouseEvent) => void) {
    this.target.addEventListener("click", handler)
    return () => this.target.removeEventListener("click", handler)
  }
}

class Svgx extends BaseSvgx {
  target: SVGSVGElement
  constructor(query: string) {
    super()
    this.target = document.querySelector(query) as SVGSVGElement
  }
  setSize(width: number, height: number) {
    this.target.setAttribute("width", width.toString())
    this.target.setAttribute("height", height.toString())
  }
  g() {
    return new G(this.target)
  }
}

export default Svgx
