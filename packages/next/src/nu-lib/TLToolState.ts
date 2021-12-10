/* eslint-disable @typescript-eslint/no-explicit-any */
import type { TLApp, TLShape, TLTool } from '~nu-lib'
import { TLState } from './TLState'

export interface TLToolStateClass<
  S extends TLShape = TLShape,
  R extends TLApp<S> = TLApp<S>,
  P extends TLTool<S, R> = TLTool<S, R>
> {
  new (tool: P, app: R): TLToolState<S, R, P>
  id: string
}

export abstract class TLToolState<
  S extends TLShape,
  R extends TLApp<S>,
  P extends TLTool<S, R>
> extends TLState<S, R, P> {
  get app() {
    return this.root
  }

  get tool() {
    return this.parent
  }
}
