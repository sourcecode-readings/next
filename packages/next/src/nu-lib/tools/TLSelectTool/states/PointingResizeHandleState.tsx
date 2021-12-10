import { Vec } from '@tldraw/vec'
import { TLApp, TLSelectTool, TLShape, TLToolState } from '~nu-lib'
import type {
  TLBinding,
  TLBoundsHandle,
  TLPinchHandler,
  TLPointerHandler,
  TLWheelHandler,
} from '~types'

export class PointingResizeHandleState<
  S extends TLShape,
  R extends TLApp<S>,
  P extends TLSelectTool<S, R>
> extends TLToolState<S, R, P> {
  static id = 'pointingResizeHandle'

  pointedHandle?: TLBoundsHandle

  onEnter = (info: { target: TLBoundsHandle }) => {
    this.pointedHandle = info.target
  }

  onWheel: TLWheelHandler = (info, gesture, e) => {
    this.onPointerMove(info, e)
  }

  onPointerMove: TLPointerHandler = () => {
    const { currentPoint, originPoint } = this.app.inputs
    if (Vec.dist(currentPoint, originPoint) > 5) {
      this.tool.transition('resizing', { handle: this.pointedHandle })
    }
  }

  onPointerUp: TLPointerHandler = () => {
    this.tool.transition('idle')
  }

  onPinchStart: TLPinchHandler = (info, gesture, event) => {
    this.tool.transition('pinching', { info, gesture, event })
  }
}
