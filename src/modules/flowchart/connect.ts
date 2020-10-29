import Svgx, { SvgxElement, SvgxG } from "../svgx"
import { Pos } from "@types"
class Connect {
  g: SvgxG
  elements: SvgxElement[] = []
  constructor(
    g: SvgxG,
    start: Pos,
    end: Pos,
    type: "combine" | "split" | "straight"
  ) {
    this.g = g
    if (type === "straight" || Math.abs(start.y - end.y) < 0.5) {
      console.log(start, end)
      this.g.path(`M${start.x},${start.y}L${end.x},${end.y}`)
      return
    }

    let M = ""
    let L1 = ""
    let A1 = ""
    let L2 = ""
    let A2 = ""
    let L3 = ""
    if (type === "split") {
      M = `M${start.x},${start.y}`
      L1 = `L${start.x + 10},${start.y}`
      L3 = `L${end.x},${end.y}`
      if (end.y > start.y) {
        A1 = `A5 5 0 0 1, ${start.x + 15},${start.y + 5}`
        L2 = `L${start.x + 15},${end.y - 5}`
        A2 = `A5 5 0 0 0, ${start.x + 20},${end.y}`
      } else {
        A1 = `A5 5 0 0 0, ${start.x + 15},${start.y - 5}`
        L2 = `L${start.x + 15},${end.y + 5}`
        A2 = `A5 5 0 0 1, ${start.x + 20},${end.y}`
      }
    }
    if (type === "combine") {
      M = `M${end.x},${end.y}`
      L1 = `L${end.x - 10},${end.y}`
      L3 = `L${start.x},${start.y}`
      if (end.y > start.y) {
        A1 = `A5 5 0 0 1, ${end.x - 15},${end.y - 5}`
        L2 = `L${end.x - 15},${start.y + 5}`
        A2 = `A5 5 0 0 0, ${end.x - 20},${start.y}`
      } else {
        A1 = `A5 5 0 0 0, ${end.x - 15},${end.y + 5}`
        L2 = `L${end.x - 15},${start.y - 5}`
        A2 = `A5 5 0 0 1, ${end.x - 20},${start.y}`
      }
    }
    this.g.path(M + L1 + A1 + L2 + A2 + L3)
  }
}
export default Connect
