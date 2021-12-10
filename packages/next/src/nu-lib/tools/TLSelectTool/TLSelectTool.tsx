import type { TLApp, TLShape } from '~nu-lib'
import { TLTool } from '../../TLTool'
import {
  IdleState,
  BrushingState,
  PointingCanvasState,
  PointingShapeState,
  PointingShapeBehindBoundsState,
  PointingBoundsBackgroundState,
  PointingSelectedShapeState,
  PointingResizeHandleState,
  PointingRotateHandleState,
  TranslatingState,
  ResizingState,
  RotatingState,
  PinchingState,
} from './states'

export class TLSelectTool<S extends TLShape, R extends TLApp<S> = TLApp<S>> extends TLTool<S, R> {
  static id = 'select'

  static initial = 'idle'

  static shortcut = 'v,1'

  static states = [
    IdleState,
    BrushingState,
    PointingCanvasState,
    PointingShapeState,
    PointingShapeBehindBoundsState,
    PointingSelectedShapeState,
    PointingBoundsBackgroundState,
    PointingResizeHandleState,
    PointingRotateHandleState,
    TranslatingState,
    ResizingState,
    RotatingState,
    RotatingState,
    PinchingState,
  ]
}
