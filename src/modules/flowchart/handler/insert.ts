import { RootNode, BodyNode, Node, SingleNode } from "@types"
import produce from "immer"
type InsertDirection = "prev" | "next"
type InsertType = "simple" | "group" | "choice"
function insert(
  root: RootNode,
  start: Node,
  end: Node,
  direction: InsertDirection,
  type: InsertType
) {}
export default insert
