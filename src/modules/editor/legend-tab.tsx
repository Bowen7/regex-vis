import React from "react"
import { useTheme, Divider } from "@geist-ui/react"
import ArrowLeftCircle from "@geist-ui/react-icons/arrowLeftCircle"
import LegendItem from "@/components/legend-item"
import legends from "./legends"
function Legend() {
  const { palette } = useTheme()
  return (
    <>
      <div className="container">
        <div className="tip">
          <ArrowLeftCircle size={14} />
          You can select nodes by dragging or clicking
        </div>
        <Divider y={0.5} />
        {legends.map(({ name, infos }) => (
          <LegendItem name={name} infos={infos} key={name} />
        ))}
      </div>
      <style jsx>{`
        .container {
          padding: 0 12px;
        }
        .tip {
          font-size: 14px;
        }
        .tip :global(svg) {
          margin-right: 6px;
          vertical-align: middle;
        }

        .container :global(.box-fill) {
          fill: ${palette.success};
        }
        .container :global(.selected-fill) {
          fill: ${palette.success};
          fill-opacity: 0.3;
        }
        .container :global(.none-stroke) {
          stroke: none;
        }
        .container :global(.stroke) {
          stroke: ${palette.accents_6};
          stroke-width: 1.5px;
        }
        .container :global(.thin-stroke) {
          stroke: ${palette.accents_6};
          stroke-width: 1.5px;
        }
        .container :global(.second-stroke) {
          stroke: ${palette.accents_3};
          stroke-width: 1.5px;
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
        .container :global(.quote) {
          fill: ${palette.accents_4};
        }
      `}</style>
    </>
  )
}

export default Legend
