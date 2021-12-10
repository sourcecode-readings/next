import type { TLApp, TLShape } from '~nu-lib'
import { TLTool } from '../../TLTool'
import {
  IdleState,
  BrushingState,
  PointingShapeState,
  PointingShapeBehindBoundsState,
  PointingCanvasState,
  PointingBoundsBackgroundState,
  TranslatingShapesState,
  PointingSelectedShapeState,
  PointingResizeHandleState,
  ResizingShapesState,
  RotatingShapesState,
  PointingRotateHandleState,
  PinchingState,
} from './states'

export class TLSelectTool<S extends TLShape, R extends TLApp<any> = TLApp<any>> extends TLTool<
  S,
  R
> {
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
    TranslatingShapesState,
    PointingResizeHandleState,
    ResizingShapesState,
    PointingRotateHandleState,
    RotatingShapesState,
    RotatingShapesState,
    PinchingState,
  ]
}
