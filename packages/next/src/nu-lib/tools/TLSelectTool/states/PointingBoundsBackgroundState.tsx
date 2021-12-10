import { Vec } from '@tldraw/vec'
import { TLApp, TLSelectTool, TLShape, TLToolState } from '~nu-lib'
import type { TLBinding, TLPinchHandler, TLPointerHandler, TLWheelHandler } from '~types'

export class PointingBoundsBackgroundState<
  S extends TLShape,
  R extends TLApp<S>,
  P extends TLSelectTool<S, R>
> extends TLToolState<S, R, P> {
  static id = 'pointingBoundsBackground'

  onWheel: TLWheelHandler = (info, gesture, e) => {
    this.onPointerMove(info, e)
  }

  onPointerMove: TLPointerHandler = () => {
    const { currentPoint, originPoint } = this.app.inputs
    if (Vec.dist(currentPoint, originPoint) > 5) {
      this.tool.transition('translating')
    }
  }

  onPointerUp: TLPointerHandler = () => {
    this.app.deselectAll()
    this.tool.transition('idle')
  }

  onPinchStart: TLPinchHandler = (info, gesture, event) => {
    this.tool.transition('pinching', { info, gesture, event })
  }
}
