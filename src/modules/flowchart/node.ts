import { Quantifier } from "@types"
import Svgx, { SvgxElement, SvgxG, Attr } from "../svgx"
import addSvg from "@assets/add.svg"
import Rect from "../svgx/rect"
import {
  FLOW_NODE_BORDER_RADIUS,
  FLOW_GROUP_PADDING_HORIZONTAL,
} from "./config"
import { Box } from "./types"
type RectHandlers = {
  insert?: (id: number, direction: "prev" | "next") => void
  select?: (id: number) => void
}
type NodeConfigs = {
  box: Box
  text: string
  id: number
  handlers?: RectHandlers
  type: "root" | "basic" | "group"
  quantifier?: Quantifier
}
class FlowNode {
  svgx: Svgx
  g: SvgxG
  id: number
  selected = false
  rect!: Rect
  configs: NodeConfigs
  constructor(svgx: Svgx, configs: NodeConfigs) {
    this.configs = configs
    const { box, text, id, handlers, type } = configs
    this.svgx = svgx
    this.id = id
    let { x, y, width, height } = box
    this.g = svgx.g()

    let radius = FLOW_NODE_BORDER_RADIUS
    const attr: Attr = {}
    if (type === "root") {
      radius = width
    }
    if (type === "group") {
      attr["stroke-dasharray"] = "5,5"
      attr.fill = "transparent"
      x -= FLOW_GROUP_PADDING_HORIZONTAL
      width += FLOW_GROUP_PADDING_HORIZONTAL * 2
    }

    this.rect = this.g.rect(x, y, width, height, radius).attr(attr)

    const center = {
      x: x + width / 2,
      y: y + height / 2,
    }
    this.renderQuantifier()

    if (text) {
      this.g.text(center.x, center.y, text).attr({
        "font-size": 16,
      })
    }

    let tmpEls: SvgxElement[] = []
    this.g.enter(e => {
      const rect1 = this.g.rect(x - 21.5, y, 21.5, height).attr({
        stroke: "none",
        fill: "transparent",
      })
      const rect2 = this.g.rect(x + width, y, 21.5, height).attr({
        stroke: "none",
        fill: "transparent",
      })
      const image1 = this.g.image(addSvg, x - 21.5, y + height / 2 - 10, 20, 20)
      const image2 = this.g.image(
        addSvg,
        x + width + 1.5,
        y + height / 2 - 10,
        20,
        20
      )
      image1.click(() => {})
      image2.click(() => {})
      tmpEls = [rect1, rect2, image1, image2]
    })
    this.g.leave(() => {
      tmpEls.forEach(tmpEl => tmpEl.remove())
      tmpEls = []
    })
  }
  renderQuantifier() {
    const { quantifier, box } = this.configs
    const { width, height, x, y } = box
    const center = {
      x: x + width / 2,
      y: y + height / 2,
    }
    if (quantifier) {
      const { min, max } = quantifier
      if (min === 0) {
        const left = {
          x,
          y: y + height / 2,
        }
        const right = {
          x: x + width,
          y: y + height / 2,
        }
        this.g.path(
          `M${left.x - 15},${left.y}` +
            `A5 5 0 0 0,${left.x - 10},${left.y - 5}` +
            `L${left.x - 10},${left.y - height / 2 - 5}` +
            `A5 5 0 0 1,${left.x - 5},${left.y - height / 2 - 10}` +
            `L${left.x + width + 5},${left.y - height / 2 - 10}` +
            `A5 5 0 0 1,${left.x + width + 10},${left.y - height / 2 - 5}` +
            `L${left.x + width + 10},${left.y - 5}` +
            `A5 5 0 0 0,${right.x + 15},${right.y}`
        )
      }
      if (max > 1) {
        let text = ""
        if (max !== Infinity) {
          text += Math.max(0, min - 1)
          if (max !== min) {
            text += " - "
            text += max - 1
          }
          text += " 次"
        }
        this.g.path(
          `M${center.x - 7.5},${y + height}` +
            `A10 10 0 1 0,${center.x + 7.5},${y + height}`
        )
        this.g.path(
          `M${center.x + 6.5},${y + height + 7}` +
            `L${center.x + 10},${y + height + 10.5}` +
            `L${center.x + 13.5},${y + height + 7}`
        )

        text &&
          this.g.text(center.x, y + height + 25, text).attr({
            "font-size": 14,
          })
      }
    }
  }
  select() {
    if (this.selected) {
      this.rect.attr({
        stroke: "#000",
      })
    } else {
      this.rect.attr({
        stroke: "#50E3C2",
      })
    }
    this.selected = !this.selected
  }
}
export default FlowNode
