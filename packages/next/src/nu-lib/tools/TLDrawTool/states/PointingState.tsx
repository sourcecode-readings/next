import { Vec } from '@tldraw/vec'
import { TLApp, TLShape, TLDrawShape, TLDrawTool, TLToolState } from '~nu-lib'
import type { TLPointerHandler } from '~types'
import { uniqueId } from '~utils'

export class PointingState<
  S extends TLShape,
  T extends S & TLDrawShape,
  R extends TLApp<S>,
  P extends TLDrawTool<T, S, R>
> extends TLToolState<S, R, P> {
  static id = 'pointing'

  onPointerMove: TLPointerHandler = () => {
    const { currentPoint, originPoint } = this.app.inputs
    if (Vec.dist(currentPoint, originPoint) > 5) {
      this.tool.transition('creating')
      this.app.deselectAll()
    }
  }

  onPointerUp: TLPointerHandler = () => {
    const { shapeClass } = this.tool

    const { originPoint } = this.app.inputs

    const shape = new shapeClass({
      id: uniqueId(),
      parentId: this.app.currentPage.id,
      point: originPoint,
      points: [[0, 0, 0.5]],
    })

    this.app.currentPage.addShapes(shape)

    this.tool.transition('idle')
  }
}
