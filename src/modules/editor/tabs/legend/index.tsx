import React from "react"
import { useTheme } from "@geist-ui/react"
import LegendItem from "@/components/legend-item"
import legends from "./legends"

function Legend() {
  const { palette } = useTheme()
  return (
    <>
      <div className="container">
        {legends.map(({ name, infos }) => (
          <LegendItem name={name} infos={infos} key={name} />
        ))}
      </div>
      <style jsx>{`
        .container {
          padding: 0 12px;
        }

        .container :global(.box-fill) {
          fill: ${palette.success};
        }
        .container :global(.selected-fill) {
          fill: ${palette.success};
          fill-opacity: 0.5;
        }
        .container :global(.none-stroke) {
          stroke: none;
        }
        .container :global(.stroke) {
          stroke: ${palette.foreground};
        }
        .container :global(.second-stroke) {
          stroke: ${palette.accents_6};
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
