/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react'
import type { TLShape } from '~nu-lib'
import type { TLRendererContext } from '~types'

export const contextMap: Record<string, React.Context<TLRendererContext<any>>> = {}

export function getRendererContext<S extends TLShape = TLShape>(
  id = 'noid'
): React.Context<TLRendererContext<S>> {
  if (!contextMap[id]) {
    contextMap[id] = React.createContext({} as TLRendererContext<S>)
  }
  return contextMap[id]
}

export function useRendererContext<S extends TLShape = TLShape>(id = 'noid'): TLRendererContext<S> {
  return React.useContext(getRendererContext<S>(id))
}
