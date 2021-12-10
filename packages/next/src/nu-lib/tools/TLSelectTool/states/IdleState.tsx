import { TLShape, TLApp, TLSelectTool, TLToolState } from '~nu-lib'
import { TLPinchHandler, TLPointerHandler, TLShortcut, TLTargetType } from '~types'
import { PointUtils } from '~utils'

export class IdleState<
  S extends TLShape,
  R extends TLApp<S>,
  P extends TLSelectTool<S, R>
> extends TLToolState<S, R, P> {
  static id = 'idle'

  static shortcuts: TLShortcut<TLShape, TLApp>[] = [
    {
      keys: 'Delete,Backspace',
      fn: (app) => app.delete(),
    },
    {
      keys: 'cmd+a,ctrl+a',
      fn: (app) => app.selectAll(),
    },
  ]

  onExit = () => {
    this.app.hover(undefined)
  }

  onPointerEnter: TLPointerHandler<S> = (info) => {
    if (info.order > 0) return

    if (info.type === TLTargetType.Shape) {
      this.app.hover(info.target.id)
    }
  }

  onPointerDown: TLPointerHandler<S> = (info, event) => {
    const {
      selectedShapes,
      inputs: { ctrlKey },
    } = this.app

    // Holding ctrlKey should ignore shapes
    if (ctrlKey) {
      this.tool.transition('pointingCanvas')
      return
    }

    switch (info.type) {
      case TLTargetType.Bounds: {
        switch (info.target) {
          case 'center': {
            break
          }
          case 'background': {
            this.tool.transition('pointingBoundsBackground')
            break
          }
          case 'rotate': {
            this.tool.transition('pointingRotateHandle')
            break
          }
          default: {
            this.tool.transition('pointingResizeHandle', { target: info.target })
          }
        }
        break
      }
      case TLTargetType.Shape: {
        if (selectedShapes.includes(info.target)) {
          this.tool.transition('pointingSelectedShape', { target: info.target })
        } else {
          const { selectedBounds, inputs } = this.app
          if (selectedBounds && PointUtils.pointInBounds(inputs.currentPoint, selectedBounds)) {
            this.tool.transition('pointingShapeBehindBounds', { target: info.target })
          } else {
            this.tool.transition('pointingShape', { target: info.target })
          }
        }
        break
      }
      case TLTargetType.Canvas: {
        this.tool.transition('pointingCanvas')
        break
      }
    }
  }

  onPointerLeave: TLPointerHandler<S> = (info) => {
    if (info.order > 0) return

    if (info.type === TLTargetType.Shape) {
      if (this.app.hoveredId) {
        this.app.hover(undefined)
      }
    }
  }

  onPinchStart: TLPinchHandler<S> = (info, gesture, event) => {
    this.tool.transition('pinching', { info, gesture, event })
  }
}
