import React from "react"
import { Link } from "react-router-dom"
import { useTheme, Code } from "@geist-ui/core"
import MinimumGraph from "@/modules/graph/minimum-graph"

const samples = [
  { desc: "1. Whole Numbers", label: "/^\\d+$/", regex: "^\\d+$" },
  {
    desc: "2. Decimal Numbers",
    label: "/^\\d*\\.\\d+$/",
    regex: "^\\d*\\.\\d+$",
  },
  {
    desc: "3. Whole + Decimal Numbers",
    label: "/^\\d*(\\.\\d+)?$/",
    regex: "^\\d*(\\.\\d+)?$",
  },
  {
    desc: "4. Negative, Positive Whole + Decimal Numbers",
    label: "/^-?\\d*(\\.\\d+)?$/",
    regex: "^-?\\d*(\\.\\d+)?$",
  },
  {
    desc: "5. Url",
    label:
      "/^https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{2,256}\\.[a-z]{2,6}\\b([-a-zA-Z0-9@:%_\\+.~#()?&//=]*)$/",
    regex:
      "^https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{2,256}\\.[a-z]{2,6}\\b([-a-zA-Z0-9@:%_\\+.~#()?&//=]*)$",
  },
  {
    desc: "6. Date Format YYYY-MM-dd",
    label: "/[12]\\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01])/",
    regex: "[12]\\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01])",
  },
]
const Samples: React.FC<{}> = () => {
  const { palette } = useTheme()
  const isLiteral = localStorage.getItem("isLiteral") === "1"
  return (
    <>
      <div className="wrapper">
        <div className="content">
          {samples.map(({ desc, label, regex }) => (
            <Link
              to={`/?r=${encodeURIComponent(
                isLiteral ? regex : regex.slice(1, regex.length - 1)
              )}`}
              key={regex}
            >
              <div className="sample">
                <p>
                  {desc}: <Code>{label}</Code>
                </p>
                <div className="svg-wrapper">
                  <MinimumGraph regex={regex} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <style jsx>{`
        .wrapper {
          height: calc(100vh - 64px);
          overflow-y: auto;
          background-color: ${palette.accents_1};
        }
        .content {
          max-width: 1200px;
          padding: 24px;
          margin: 0 auto;
        }
        .sample {
          margin-bottom: 48px;
        }

        ::-webkit-scrollbar {
          display: none;
        }

        .svg-wrapper {
          overflow-x: auto;
        }

        .content :global(.selected-fill) {
          fill: ${palette.success};
          fill-opacity: 0.3;
        }
        .content :global(.none-stroke) {
          stroke: none;
        }
        .content :global(.stroke) {
          stroke: ${palette.accents_6};
          stroke-width: 1.5px;
        }
        .content :global(.thin-stroke) {
          stroke: ${palette.accents_6};
          stroke-width: 1.5px;
        }
        .content :global(.second-stroke) {
          stroke: ${palette.accents_3};
          stroke-width: 1.5px;
        }
        .content :global(.text) {
          fill: ${palette.foreground};
        }
        .content :global(.fill) {
          fill: ${palette.background};
        }
        .content :global(.transparent-fill) {
          fill: transparent;
        }
        .content :global(.quote) {
          fill: ${palette.accents_4};
        }
      `}</style>
    </>
  )
}

export default Samples
