import { TLApp, TLBush, TLSelectTool, TLToolState, TLShape } from '~nu-lib'
import { BoundsUtils } from '~utils'
import type { TLKeyboardHandler, TLPointerHandler, TLWheelHandler } from '~types'

export class BrushingState<
  S extends TLShape,
  R extends TLApp<S>,
  P extends TLSelectTool<S, R>
> extends TLToolState<S, R, P> {
  static id = 'brushing'

  private initialSelectedIds: string[] = []
  private initialSelectedShapes: S[] = []

  private tree: TLBush<S> = new TLBush()

  onEnter = () => {
    const { selectedShapes, currentPage, selectedIds } = this.app
    this.initialSelectedIds = [...selectedIds]
    this.initialSelectedShapes = [...selectedShapes]
    this.tree.load(currentPage.shapes)
  }

  onExit = () => {
    this.initialSelectedIds = []
    this.tree.clear()
  }

  onWheel: TLWheelHandler<S> = (info, gesture, e) => {
    this.onPointerMove(info, e)
  }

  onPointerMove: TLPointerHandler<S> = () => {
    const {
      inputs: { shiftKey, ctrlKey, originPoint, currentPoint },
    } = this.app

    const brushBounds = BoundsUtils.getBoundsFromPoints([currentPoint, originPoint], 0)

    this.app.setBrush(brushBounds)

    const hits = this.tree
      .search(brushBounds)
      .filter((shape) =>
        ctrlKey
          ? BoundsUtils.boundsContain(brushBounds, shape.rotatedBounds)
          : shape.hitTestBounds(brushBounds)
      )

    if (shiftKey) {
      if (hits.every((hit) => this.initialSelectedShapes.includes(hit))) {
        // Deselect hit shapes
        this.app.select(...this.initialSelectedShapes.filter((hit) => !hits.includes(hit)))
      } else {
        // Select hit shapes + initial selected shapes
        this.app.select(...Array.from(new Set([...this.initialSelectedShapes, ...hits]).values()))
      }
    } else {
      // Select hit shapes
      this.app.select(...hits)
    }
  }

  onPointerUp: TLPointerHandler = () => {
    this.app.clearBrush()
    this.tool.transition('idle')
  }

  handleModifierKey: TLKeyboardHandler = (info, e) => {
    switch (e.key) {
      case 'Escape': {
        this.app.clearBrush()
        this.app.select(...this.initialSelectedIds)
        this.tool.transition('idle')
        break
      }
    }
  }
}
