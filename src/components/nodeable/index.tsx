import React, {
  ReactElement,
  useRef,
  useState,
  useEffect,
  CSSProperties,
} from "react"
import { Pos, DragEvent } from "@types"
import addSvg from "@assets/add.svg"
import connectSvg from "@assets/connect.svg"
function checkStayInRect(e: React.MouseEvent, rect: DOMRect) {
  const { pageX, pageY } = e
  let { top, right, bottom, left } = rect
  right += 25
  left -= 25
  return pageX > left && pageX < right && pageY > top && pageY < bottom
}
type NodeableProps = {
  id: number
  width: number
  height: number
  origin: Pos
  onDragEnd?: (event: DragEvent) => void
  onDrag?: (event: DragEvent) => void
  onAddNode?: (direction: "prev" | "next") => void
}

const Nodeable: React.FC<NodeableProps> = props => {
  const { children, id, origin, width, height } = props
  const ref = useRef<Element>(null)
  const [addVisible, setAddVisible] = useState<boolean>(false)
  const [rect, setRect] = useState<DOMRect>()
  const dragStartPoint = useRef<Pos>()

  useEffect(() => {
    const rect = ref.current?.getBoundingClientRect()
    setRect(rect)
  }, [origin, width, height])

  function onDrag(e: MouseEvent) {
    if (dragStartPoint.current) {
      const deltaX = e.clientX - dragStartPoint.current.x
      const deltaY = e.clientY - dragStartPoint.current.y
      props.onDrag &&
        props.onDrag({
          deltaX,
          deltaY,
          id,
        })
    }
  }
  function onDragEnd(e: MouseEvent) {
    if (dragStartPoint.current) {
      const deltaX = e.clientX - dragStartPoint.current.x
      const deltaY = e.clientY - dragStartPoint.current.y
      props.onDragEnd &&
        props.onDragEnd({
          deltaX,
          deltaY,
          id,
        })
    }
    document.removeEventListener("mousemove", onDrag)
    document.removeEventListener("mouseup", onDragEnd)
  }
  function onMouseDown(e: React.MouseEvent) {
    dragStartPoint.current = {
      x: e.clientX,
      y: e.clientY,
    }
    document.addEventListener("mousemove", onDrag)
    document.addEventListener("mouseup", onDragEnd)
  }
  function onMouseEnter(e: React.MouseEvent) {
    setAddVisible(true)
  }
  function onMouseLeave(e: React.MouseEvent) {
    if (rect && checkStayInRect(e, rect)) {
      return
    }
    setAddVisible(false)
  }
  function onAddMouseLeave(e: React.MouseEvent) {
    if (rect && checkStayInRect(e, rect)) {
      return
    }
    setAddVisible(false)
  }

  function renderAdd() {
    function handleAddOnPrev() {
      handleAdd("prev")
    }
    function handleAddOnNext() {
      handleAdd("next")
    }
    function handleAdd(direction: "prev" | "next") {
      props.onAddNode && props.onAddNode(direction)
    }

    const foreignObjectProps = {
      y: origin.y,
      width: 25,
      height,
      onMouseEnter,
      onMouseLeave: onAddMouseLeave,
    }
    const imgProps: React.ImgHTMLAttributes<HTMLImageElement> = {
      src: addSvg,
      width: 20,
      height: 20,
    }
    const commonStyle: CSSProperties = {
      display: "flex",
      justifyContent: "flex-start",
      alignItems: "center",
      width: "25px",
      height: `${height}px`,
    }
    return (
      addVisible && (
        <>
          <foreignObject x={origin.x - 25} {...foreignObjectProps}>
            {/* Property 'xmlns' does not exist on 'div' */}
            {/* so, use React.createElement to support full svg properties */}
            {React.createElement(
              "div",
              {
                style: {
                  ...commonStyle,
                  justifyContent: "flex-start",
                },
                xmlns: "http://www.w3.org/1999/xhtml",
              },
              <img alt="" onClick={handleAddOnPrev} {...imgProps} />
            )}
          </foreignObject>

          <foreignObject x={origin.x + width} {...foreignObjectProps}>
            {React.createElement(
              "div",
              {
                style: {
                  ...commonStyle,
                  justifyContent: "flex-end",
                },
                xmlns: "http://www.w3.org/1999/xhtml",
              },
              <img alt="" onClick={handleAddOnNext} {...imgProps} />
            )}
          </foreignObject>
        </>
      )
    )
  }

  const pointProps = {
    xlinkHref: connectSvg,
    width: 10,
    height: 10,
  }
  return (
    <>
      {React.cloneElement(React.Children.only(children) as ReactElement, {
        onMouseDown,
        onMouseEnter,
        onMouseLeave,
        ref,
      })}
      <image
        x={origin.x - 5}
        y={origin.y + height / 2 - 5}
        {...pointProps}
      ></image>
      <image
        x={origin.x + width - 5}
        y={origin.y + height / 2 - 5}
        {...pointProps}
      ></image>
      {renderAdd()}
    </>
  )
}

export default Nodeable
