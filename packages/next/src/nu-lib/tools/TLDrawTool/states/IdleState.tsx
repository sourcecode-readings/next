import type { TLShape, TLApp, TLDrawShape } from '~nu-lib'
import { TLToolState, TLDrawTool } from '~nu-lib'
import type { TLPinchHandler, TLPointerHandler, TLShortcut } from '~types'

export class IdleState<
  S extends TLShape,
  T extends S & TLDrawShape,
  R extends TLApp<S>,
  P extends TLDrawTool<T, S, R>
> extends TLToolState<S, R, P> {
  static id = 'idle'
  static shortcuts: TLShortcut<TLShape, TLApp>[] = [
    {
      keys: 'cmd+a,ctrl+a',
      fn: (app) => {
        app.transition('select')
        app.selectAll()
      },
    },
  ]

  onPointerDown: TLPointerHandler = (info, e) => {
    if (info.order > 0) return
    this.tool.transition('pointing')
  }

  onPinchStart: TLPinchHandler = (...args) => {
    this.app.transition('select', { returnTo: 'draw' })
    this.app.onPinchStart?.(...args)
  }
}
