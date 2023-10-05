import { Divider } from "@geist-ui/core"
import { useTranslation } from "react-i18next"
import ArrowLeftCircle from "@geist-ui/icons/arrowLeftCircle"
import LegendItem from "@/components/legend-item"
import legends from "./legends"
function Legend() {
  const { t } = useTranslation()
  return (
    <>
      <div className="container">
        <div className="tip">
          <ArrowLeftCircle size={14} />
          {t("You can select nodes by dragging or clicking")}
        </div>
        <Divider h={0.5} />
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
      `}</style>
    </>
  )
}

export default Legend
