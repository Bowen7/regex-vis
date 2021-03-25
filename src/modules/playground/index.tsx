import React from "react"
import Guider from "@/components/guider"
import { useMainReducer, MainActionTypes } from "@/redux"
import { Modal } from "@geist-ui/react"
const Playground: React.FC<{}> = () => {
  const [{ guiderConfig }, dispatch] = useMainReducer()
  return (
    <>
      <Guider title="Regex" content="regex-vis" />
      <Modal
        open={guiderConfig.visible}
        onClose={() =>
          dispatch({
            type: MainActionTypes.UPDATE_GUIDE_CONFIG,
            payload: { ...guiderConfig, visible: false },
          })
        }
      >
        <Modal.Title>{guiderConfig.title}</Modal.Title>
        <Modal.Content>
          {typeof guiderConfig.content === "string" ? (
            <p>{guiderConfig.content}</p>
          ) : (
            guiderConfig.content
          )}
        </Modal.Content>
        <Modal.Action
          onClick={() =>
            dispatch({
              type: MainActionTypes.UPDATE_GUIDE_CONFIG,
              payload: { ...guiderConfig, visible: false },
            })
          }
        >
          I got it
        </Modal.Action>
      </Modal>
    </>
  )
}
export default Playground
