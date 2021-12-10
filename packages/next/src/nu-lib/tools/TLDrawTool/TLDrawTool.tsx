import { IdleState, PointingState, CreatingState } from './states'
import { TLTool } from '~nu-lib'
import type { TLApp, TLDrawShape, TLDrawShapeProps, TLShapeProps, TLShape } from '~nu-lib'

export abstract class TLDrawTool<
  T extends TLDrawShape = TLDrawShape,
  S extends TLShape = TLShape,
  R extends TLApp<S> = TLApp<S>
> extends TLTool<S, R> {
  static id = 'draw'

  static states = [IdleState, PointingState, CreatingState]

  static initial = 'idle'

  /** Whether to simplify the shape's points after creating. */
  simplify = true

  /** The minimum distance between points when simplifying a line. */
  simplifyTolerance = 1

  abstract shapeClass: {
    new (props: TLShapeProps & Partial<TLDrawShapeProps & unknown>): T
  }
}
