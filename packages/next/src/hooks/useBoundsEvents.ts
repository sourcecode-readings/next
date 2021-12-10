import * as React from 'react'
import { useRendererContext } from '~hooks'
import { TLBoundsHandle, TLPointerEventHandler, TLTargetType } from '~types'

export function useBoundsEvents(handle: TLBoundsHandle) {
  const { callbacks } = useRendererContext()

  const events = React.useMemo(() => {
    const onPointerMove: TLPointerEventHandler = (e) => {
      const { order = 0 } = e
      callbacks.onPointerMove?.({ type: TLTargetType.Bounds, target: handle, order }, e)
      e.order = order + 1
    }

    const onPointerDown: TLPointerEventHandler = (e) => {
      const { order = 0 } = e
      if (order) e.currentTarget.setPointerCapture(e.pointerId)
      callbacks.onPointerDown?.({ type: TLTargetType.Bounds, target: handle, order }, e)
      e.order = order + 1
    }

    const onPointerUp: TLPointerEventHandler = (e) => {
      const { order = 0 } = e
      if (order) e.currentTarget.releasePointerCapture(e.pointerId)
      callbacks.onPointerUp?.({ type: TLTargetType.Bounds, target: handle, order }, e)
      e.order = order + 1
    }

    const onPointerEnter: TLPointerEventHandler = (e) => {
      const { order = 0 } = e
      callbacks.onPointerEnter?.({ type: TLTargetType.Bounds, target: handle, order }, e)
      e.order = order + 1
    }

    const onPointerLeave: TLPointerEventHandler = (e) => {
      const { order = 0 } = e
      callbacks.onPointerLeave?.({ type: TLTargetType.Bounds, target: handle, order }, e)
      e.order = order + 1
    }

    return {
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onPointerEnter,
      onPointerLeave,
    }
  }, [callbacks])

  return events
}
