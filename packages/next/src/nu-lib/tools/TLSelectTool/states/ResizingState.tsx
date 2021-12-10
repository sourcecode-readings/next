import { Vec } from '@tldraw/vec'
import { TLApp, TLShape, TLSelectTool, TLSerializedShape, TLToolState } from '~nu-lib'
import {
  TLBounds,
  TLBoundsCorner,
  TLBoundsEdge,
  TLKeyboardHandler,
  TLPointerHandler,
  TLWheelHandler,
} from '~types'
import { BoundsUtils } from '~utils'

export class ResizingState<
  S extends TLShape,
  R extends TLApp<S>,
  P extends TLSelectTool<S, R>
> extends TLToolState<S, R, P> {
  static id = 'resizing'

  isSingle = false
  handle: TLBoundsCorner | TLBoundsEdge = TLBoundsCorner.BottomRight
  snapshots: Record<
    string,
    {
      props: TLSerializedShape
      bounds: TLBounds
      transformOrigin: number[]
    }
  > = {}
  initialRotation = 0
  initialInnerBounds = {} as TLBounds
  initialCommonBounds = {} as TLBounds
  initialCommonCenter = {} as number[]
  transformOrigins: Record<string, number[]> = {}
  boundsRotation = 0

  onEnter = (info: { handle: TLBoundsCorner | TLBoundsEdge }) => {
    this.handle = info.handle
    const { history, selectedShapes, selectedBounds } = this.app

    if (!selectedBounds) throw Error('Expected a selected bounds.')

    history.pause()

    const initialInnerBounds = BoundsUtils.getBoundsFromPoints(
      selectedShapes.map((shape) => BoundsUtils.getBoundsCenter(shape.bounds))
    )

    this.isSingle = selectedShapes.length === 1
    this.boundsRotation = this.isSingle ? selectedShapes[0].rotation ?? 0 : 0
    this.initialCommonBounds = { ...selectedBounds }
    this.initialCommonCenter = BoundsUtils.getBoundsCenter(this.initialCommonBounds)

    this.snapshots = Object.fromEntries(
      selectedShapes.map((shape) => {
        const { bounds } = shape
        const ic = BoundsUtils.getBoundsCenter(bounds)

        const ix = (ic[0] - initialInnerBounds.minX) / initialInnerBounds.width
        const iy = (ic[1] - initialInnerBounds.minY) / initialInnerBounds.height

        return [
          shape.id,
          {
            bounds,
            props: shape.serialized,
            transformOrigin: [ix, iy],
          },
        ]
      })
    )

    selectedShapes.forEach((shape) => shape.onResizeStart?.())
  }

  onExit = () => {
    this.snapshots = {}
    this.initialCommonBounds = {} as TLBounds
    this.boundsRotation = 0
    this.app.history.resume()
  }

  onWheel: TLWheelHandler = (info, gesture, e) => {
    this.onPointerMove(info, e)
  }

  onPointerMove: TLPointerHandler = () => {
    const {
      inputs: { shiftKey, originPoint, currentPoint },
    } = this.app

    const { handle, snapshots, initialCommonBounds } = this

    const delta = Vec.sub(currentPoint, originPoint)

    const nextBounds = BoundsUtils.getTransformedBoundingBox(
      initialCommonBounds,
      handle,
      delta,
      this.boundsRotation,
      shiftKey
    )

    const { scaleX, scaleY } = nextBounds

    this.app.selectedShapes.forEach((shape) => {
      const { props, bounds, transformOrigin } = snapshots[shape.id]

      const relativeBounds = BoundsUtils.getRelativeTransformedBoundingBox(
        nextBounds,
        initialCommonBounds,
        bounds,
        scaleX < 0,
        scaleY < 0
      )

      shape.onResize(relativeBounds, {
        type: handle,
        initialProps: props,
        initialBounds: bounds,
        scaleX,
        scaleY,
        transformOrigin,
      })

      // if (this.isSingle) {
      //   const offset = Vec.sub(shape.center, this.initialCommonCenter)
      //   shape.update({
      //     point: Vec.sub(shape.point, offset),
      //   })
      // }
    })
  }

  onPointerUp: TLPointerHandler = () => {
    this.app.history.resume()
    this.app.persist()
    this.tool.transition('idle')
  }

  onKeyDown: TLKeyboardHandler = (info, e) => {
    switch (e.key) {
      case 'Escape': {
        this.app.selectedShapes.forEach((shape) => {
          shape.update({ ...this.snapshots[shape.id].props })
        })
        this.tool.transition('idle')
        break
      }
    }
  }
}
