import * as React from 'react'
import type { TLApp, TLShape } from '~nu-lib'

const contextMap: Record<string, React.Context<any>> = {}

export function getAppContext<S extends TLShape = TLShape, R extends TLApp<S> = TLApp<S>>(
  id = 'noid'
): React.Context<R> {
  if (!contextMap[id]) {
    contextMap[id] = React.createContext({} as R)
  }
  return contextMap[id]
}

export function useAppContext<S extends TLShape = TLShape, R extends TLApp<S> = TLApp<S>>(
  id = 'noid'
): R {
  return React.useContext(getAppContext<S, R>(id))
}
