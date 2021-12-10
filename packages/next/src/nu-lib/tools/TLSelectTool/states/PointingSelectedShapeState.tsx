import { Vec } from '@tldraw/vec'
import { TLApp, TLSelectTool, TLToolState, TLShape } from '~nu-lib'
import type { TLPinchHandler, TLPointerHandler, TLWheelHandler } from '~types'

export class PointingSelectedShapeState<
  S extends TLShape,
  R extends TLApp<S>,
  P extends TLSelectTool<S, R>
> extends TLToolState<S, R, P> {
  static id = 'pointingSelectedShape'

  private pointedSelectedShape?: TLShape

  onEnter = (info: { target: TLShape }) => {
    this.pointedSelectedShape = info.target
  }

  onExit = () => (this.pointedSelectedShape = undefined)

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
    const { shiftKey } = this.app.inputs

    if (!this.pointedSelectedShape) throw Error('Expected a pointed selected shape')
    if (shiftKey) {
      this.app.deselect(this.pointedSelectedShape.id)
    } else {
      this.app.select(this.pointedSelectedShape.id)
    }
    this.tool.transition('idle')
  }

  onPinchStart: TLPinchHandler = (info, gesture, event) => {
    this.tool.transition('pinching', { info, gesture, event })
  }
}
