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

type OnSelect = ({
  x,
  y,
  width,
  height,
}: {
  x: number
  y: number
  width: number
  height: number
}) => void
class Svgx extends BaseSvgx {
  target: SVGSVGElement
  _onSelect: OnSelect | null = null
  constructor(query: string) {
    super()
    this.target = document.querySelector(query) as SVGSVGElement
    this.bindDragSelect()
  }
  setSize(width: number, height: number) {
    this.target.setAttribute("width", width.toString())
    this.target.setAttribute("height", height.toString())
  }
  g() {
    return new G(this.target)
  }
  onSelect(fn: OnSelect) {
    this._onSelect = fn
  }
  bindDragSelect() {
    const { target } = this
    let select: Rect | null = null
    let startX = 0
    let startY = 0
    target.addEventListener("mousedown", (e: MouseEvent) => {
      const { offsetX, offsetY } = e
      startX = offsetX
      startY = offsetY

      select = this.rect(-999, -999, 0, 0).attr({
        fill: "#50E3C2",
        "fill-opacity": 0.5,
        stroke: "none",
      })
      target.addEventListener("mousemove", mousemove)
    })

    function mousemove(e: MouseEvent) {
      const { offsetX, offsetY } = e
      const x = offsetX > startX ? startX : offsetX
      const y = offsetY > startY ? startY : offsetY
      const width = Math.abs(offsetX - startX)
      const height = Math.abs(offsetY - startY)
      select?.attr({
        x,
        y,
        width,
        height,
      })
    }
    const mouseup = (e: MouseEvent) => {
      if (select) {
        const { offsetX, offsetY } = e
        const x = offsetX > startX ? startX : offsetX
        const y = offsetY > startY ? startY : offsetY
        const width = Math.abs(offsetX - startX)
        const height = Math.abs(offsetY - startY)
        if (width > 5 && height > 5) {
          this._onSelect && this._onSelect({ x, y, width, height })
        }
        target.removeEventListener("mousemove", mousemove)
        select.remove()
        select = null
      }
    }
    target.addEventListener("mouseup", mouseup)
    target.addEventListener("mouseleave", mouseup)
  }
}

export default Svgx
