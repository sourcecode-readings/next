import * as React from 'react'
import { useRendererContext } from '~hooks'
import { TLPointerEventHandler, TLTargetType } from '~types'

export function useCanvasEvents() {
  const { callbacks } = useRendererContext()

  const events = React.useMemo(() => {
    const onPointerMove: TLPointerEventHandler = (e) => {
      const { order = 0 } = e
      callbacks.onPointerMove?.({ type: TLTargetType.Canvas, target: 'canvas', order }, e)
    }

    const onPointerDown: TLPointerEventHandler = (e) => {
      const { order = 0 } = e
      e.currentTarget.setPointerCapture(e.pointerId)
      callbacks.onPointerDown?.({ type: TLTargetType.Canvas, target: 'canvas', order }, e)
    }

    const onPointerUp: TLPointerEventHandler = (e) => {
      const { order = 0 } = e
      e.currentTarget.releasePointerCapture(e.pointerId)
      callbacks.onPointerUp?.({ type: TLTargetType.Canvas, target: 'canvas', order }, e)
    }

    const onKeyDown: React.KeyboardEventHandler = (e) => {
      callbacks.onKeyDown?.({ type: TLTargetType.Canvas, target: 'canvas', order: -1 }, e)
    }

    const onKeyUp: React.KeyboardEventHandler = (e) => {
      callbacks.onKeyUp?.({ type: TLTargetType.Canvas, target: 'canvas', order: -1 }, e)
    }

    const onPointerEnter: TLPointerEventHandler = (e) => {
      const { order = 0 } = e
      callbacks.onPointerEnter?.({ type: TLTargetType.Canvas, target: 'canvas', order }, e)
    }

    const onPointerLeave: TLPointerEventHandler = (e) => {
      const { order = 0 } = e
      callbacks.onPointerLeave?.({ type: TLTargetType.Canvas, target: 'canvas', order }, e)
    }

    return {
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onKeyDown,
      onKeyUp,
      onPointerEnter,
      onPointerLeave,
    }
  }, [callbacks])

  return events
}
