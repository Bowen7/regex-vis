import SvgxElement from "./element"
class Image extends SvgxElement {
  constructor(
    container: SVGSVGElement | SVGGElement,
    src: string,
    x: number,
    y: number,
    width: number,
    height: number
  ) {
    super()
    this.type = "text"
    this.container = container
    this.target = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "image"
    ) as SVGImageElement
    this.attr({
      x,
      y,
      width,
      height,
      src,
    })
    this.append()
  }
}
export default Image
