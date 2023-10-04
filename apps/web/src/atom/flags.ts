import { atom } from "jotai"
import { updateFlags } from "@/parser"
import { astAtom } from "./atoms"
import { pushUndoAtom } from "./utils"

export const updateFlagsAtom = atom(null, (get, set, flags: string[]) => {
  set(astAtom, (draft) => {
    updateFlags(draft, flags)
    set(pushUndoAtom, draft)
  })
})
