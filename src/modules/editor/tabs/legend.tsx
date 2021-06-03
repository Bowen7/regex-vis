import React from "react"
import { useTheme } from "@geist-ui/react"
import LegendItem from "@/components/legend-item"
import { ReactComponent as CharactersSvg } from "@/assets/characters.svg"
import { ReactComponent as SelectedSvg } from "@/assets/selected.svg"

function Legend() {
  const { palette } = useTheme()
  return (
    <>
      <div className="container">
        <LegendItem
          name="characters"
          desc="this is a desc"
          Icon={<CharactersSvg />}
        />
        <LegendItem
          name="selected"
          desc="this is a desc"
          Icon={<SelectedSvg />}
        />
      </div>
      <style jsx>{`
        .container {
          padding: 0 12px;
        }

        .container :global(.selected-stroke) {
          stroke: ${palette.success};
        }
        .container :global(.virtual-stroke) {
          stroke: rgba(50, 145, 255, 0.5);
        }
        .container :global(.none-stroke) {
          stroke: none;
        }
        .container :global(.stroke) {
          stroke: ${palette.foreground};
        }
        .container :global(.selected-text) {
          fill: ${palette.success};
        }
        .container :global(.text) {
          fill: ${palette.foreground};
        }
        .container :global(.fill) {
          fill: ${palette.background};
        }
        .container :global(.transparent-fill) {
          fill: transparent;
        }
      `}</style>
    </>
  )
}

export default Legend
