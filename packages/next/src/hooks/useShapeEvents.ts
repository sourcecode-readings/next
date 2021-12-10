import * as React from 'react'
import { useRendererContext } from '~hooks'
import type { TLShape } from '~nu-lib'
import { TLPointerEventHandler, TLTargetType } from '~types'

export function useShapeEvents(shape: TLShape) {
  const { inputs, callbacks } = useRendererContext()

  const events = React.useMemo(() => {
    const onPointerMove: TLPointerEventHandler = (e) => {
      const { order = 0 } = e
      callbacks.onPointerMove?.({ type: TLTargetType.Shape, target: shape, order }, e)
      e.order = order + 1
    }

    const onPointerDown: TLPointerEventHandler = (e) => {
      const { order = 0 } = e
      if (e.order === 0) e.currentTarget.setPointerCapture(e.pointerId)
      callbacks.onPointerDown?.({ type: TLTargetType.Shape, target: shape, order }, e)
      e.order = order + 1
    }

    const onPointerUp: TLPointerEventHandler = (e) => {
      const { order = 0 } = e
      if (e.order === 0) e.currentTarget.releasePointerCapture(e.pointerId)
      callbacks.onPointerUp?.({ type: TLTargetType.Shape, target: shape, order }, e)
      e.order = order + 1
    }

    const onPointerEnter: TLPointerEventHandler = (e) => {
      const { order = 0 } = e
      callbacks.onPointerEnter?.({ type: TLTargetType.Shape, target: shape, order }, e)
      e.order = order + 1
    }

    const onPointerLeave: TLPointerEventHandler = (e) => {
      const { order = 0 } = e
      callbacks.onPointerLeave?.({ type: TLTargetType.Shape, target: shape, order }, e)
      e.order = order + 1
    }

    const onKeyDown: React.KeyboardEventHandler = (e) => {
      callbacks.onKeyDown?.({ type: TLTargetType.Shape, target: shape, order: -1 }, e)
    }

    const onKeyUp: React.KeyboardEventHandler = (e) => {
      callbacks.onKeyUp?.({ type: TLTargetType.Shape, target: shape, order: -1 }, e)
    }

    return {
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onPointerEnter,
      onPointerLeave,
      onKeyUp,
      onKeyDown,
    }
  }, [shape.id, inputs, callbacks])

  return events
}
