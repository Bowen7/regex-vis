import React from "react"
import { Link } from "react-router-dom"
import { useTheme } from "@geist-ui/react"
import {
  WholeNumbersSvg,
  DecimalNumberSvg,
  WholeDecimalNumberSvg,
  NegativePositiveWholeDecimalNumbersSvg,
  UrlSvg,
  DateSvg,
} from "@/assets"

const samples = [
  { desc: "1. Whole Numbers", Svg: WholeNumbersSvg, regex: "/^\\d+$/" },
  {
    desc: "2. Decimal Numbers",
    Svg: DecimalNumberSvg,
    regex: "/^\\d*\\.\\d+$/",
  },
  {
    desc: "3. Whole + Decimal Numbers",
    Svg: WholeDecimalNumberSvg,
    regex: "/^\\d*(\\.\\d+)?$/",
  },
  {
    desc: "4. Negative, Positive Whole + Decimal Numbers",
    Svg: NegativePositiveWholeDecimalNumbersSvg,
    regex: "/^-?\\d*(\\.\\d+)?$/",
  },
  {
    desc: "5. Url",
    Svg: UrlSvg,
    regex:
      "/^https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{2,256}\\.[a-z]{2,6}\\b([-a-zA-Z0-9@:%_\\+.~#()?&//=]*)$/",
  },
  {
    desc: "6. Date Format YYYY-MM-dd",
    Svg: DateSvg,
    regex: "/[12]\\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01])/",
  },
]
const Samples: React.FC<{}> = () => {
  const { palette } = useTheme()

  return (
    <>
      <div className="wrapper">
        <div className="content">
          {samples.map(({ desc, Svg, regex }) => (
            <Link to={`/?r=${encodeURIComponent(regex)}`} key={regex}>
              <div className="sample">
                <p>{desc}</p>
                <div className="svg-wrapper">
                  <Svg />
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
