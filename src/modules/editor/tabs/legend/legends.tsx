import React from "react"
import { ReactComponent as CharactersSvg } from "@/assets/characters.svg"
import { ReactComponent as SelectedSvg } from "@/assets/selected.svg"
const legends = [
  {
    name: "characters",
    infos: [
      {
        Icon: <CharactersSvg />,
        desc: "match the 'abc' characters",
      },
    ],
  },
  {
    name: "selected",
    infos: [
      {
        Icon: <SelectedSvg />,
        desc: "a selected node, can be modified in the 'Edit' tab",
      },
    ],
  },
]

export default legends
