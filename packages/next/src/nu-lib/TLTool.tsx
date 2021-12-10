import type { TLApp, TLShape } from '~nu-lib'
import { TLState } from './TLState'

export interface TLToolClass<S extends TLShape = TLShape, R extends TLApp<S> = TLApp<S>> {
  new (parent: R, app: R): TLTool<S, R>
  id: string
}

export abstract class TLTool<
  S extends TLShape = TLShape,
  R extends TLApp<S> = TLApp<S>
> extends TLState<S, R, R> {
  get app() {
    return this.root
  }
}
