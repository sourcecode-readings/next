import * as React from 'react'
import type { TLApp } from '@tldraw/next'
import type { Shape } from 'stores'

type NuAppContext = TLApp<Shape> | undefined

export const appContext = React.createContext({} as NuAppContext)

export function useAppContext() {
  return React.useContext(appContext)
}
