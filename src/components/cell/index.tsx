import React from "react"
import { useTheme } from "@geist-ui/react"
import QuestionCircle from "@geist-ui/react-icons/questionCircle"
import questions, { QuestionKey } from "@/utils/questions"

type ItemProps = {
  label: string
}
const CellItem: React.FC<ItemProps> = ({ label, children }) => {
  const { palette } = useTheme()
  return (
    <>
      <h6>{label}</h6>
      {children}
      <style jsx>{`
        h6 {
          color: ${palette.secondary};
        }
      `}</style>
    </>
  )
}

type Props = {
  label: string
  question?: QuestionKey
}
const Cell: React.FC<Props> & { Item: typeof CellItem } = ({
  label,
  question,
  children,
}) => {
  const { palette } = useTheme()
  return (
    <>
      <div className="container">
        <div className="title">
          <div className="left">
            <h5>{label}</h5>
            {question && (
              <a href={questions[question]} target="_blank" rel="noreferrer">
                <QuestionCircle size={16} />
              </a>
            )}
          </div>
        </div>
        <div className="content">{children}</div>
      </div>
      <style jsx>{`
        .container:not(:last-of-type) {
          margin-bottom: 30px;
        }
        .title {
          display: flex;
          align-items: flex-end;
          margin-bottom: 0.625rem;
        }
        h5 {
          margin: 0;
        }
        h5 + :global(a) {
          margin-left: 6px;
          cursor: pointer;
          color: ${palette.foreground};
          line-height: 0;
        }
        .left {
          display: flex;
          align-items: center;
        }

        .content {
          font-size: 14px;
        }

        .content > :global(h6:not(:first-of-type)) {
          margin-top: calc(7.625pt - 0.5px);
        }
      `}</style>
    </>
  )
}

Cell.Item = CellItem
export default Cell
