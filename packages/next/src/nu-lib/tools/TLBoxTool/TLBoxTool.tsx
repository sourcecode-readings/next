import { IdleState, PointingState, CreatingState } from './states'
import { TLTool } from '~nu-lib'
import type { TLShortcut } from '~types'
import type { TLApp, TLShape, TLBoxShapeProps, TLBoxShape, TLShapeProps } from '~nu-lib'

// shape tools need to have two generics: a union of all shapes in
// the app, and the particular shape that they'll be creating

export abstract class TLBoxTool<
  T extends TLBoxShape = TLBoxShape,
  S extends TLShape = TLShape,
  R extends TLApp<S> = TLApp<S>
> extends TLTool<S, R> {
  static id = 'box'

  static states = [IdleState, PointingState, CreatingState]

  static initial = 'idle'

  static shortcuts: TLShortcut<TLShape, TLApp>[] = [
    {
      keys: 'cmd+a,ctrl+a',
      fn: (app) => {
        app.transition('select')
        app.selectAll()
      },
    },
  ]

  abstract shapeClass: {
    new (props: TLShapeProps & Partial<TLBoxShapeProps & unknown>): T
  }
}
