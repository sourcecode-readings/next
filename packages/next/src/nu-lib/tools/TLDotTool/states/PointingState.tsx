import { Vec } from '@tldraw/vec'
import type { TLApp, TLShape, TLDotShape, TLDotTool } from '~nu-lib'
import { TLToolState } from '~nu-lib'
import type { TLPointerHandler } from '~types'

export class PointingState<
  S extends TLShape,
  T extends S & TLDotShape,
  R extends TLApp<S>,
  P extends TLDotTool<T, S, R>
> extends TLToolState<S, R, P> {
  static id = 'pointing'

  onPointerMove: TLPointerHandler = () => {
    const { currentPoint, originPoint } = this.app.inputs
    if (Vec.dist(currentPoint, originPoint) > 5) {
      this.tool.transition('creating')
      this.app.deselectAll()
    }
  }
}
