/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react'
import { observer } from 'mobx-react-lite'
import {
  BoundsBackground as _BoundsBackground,
  BoundsForeground as _BoundsForeground,
  BoundsDetail as _BoundsDetail,
} from '~components'
import type { TLShape, TLInputs, TLViewport } from '~nu-lib'
import { autorun } from 'mobx'
import type { TLRendererContext, TLComponents, TLCallbacks } from '~types'
import { getRendererContext } from '~hooks'
import { EMPTY_OBJECT } from '~constants'

export interface TLRendererContextProps<S extends TLShape = TLShape> {
  id?: string
  viewport: TLViewport
  inputs: TLInputs
  callbacks?: Partial<TLCallbacks<S>>
  components?: Partial<TLComponents<S>>
  meta?: any
  children?: React.ReactNode
}

export const RendererContext = observer(function App<S extends TLShape>({
  id = 'noid',
  viewport,
  inputs,
  callbacks = EMPTY_OBJECT,
  meta = EMPTY_OBJECT,
  components = EMPTY_OBJECT,
  children,
}: TLRendererContextProps<S>): JSX.Element {
  const [currentContext, setCurrentContext] = React.useState<TLRendererContext<S>>(() => {
    const { ContextBar, BoundsBackground, BoundsForeground, BoundsDetail } = components

    return {
      id,
      viewport,
      inputs,
      callbacks,
      meta,
      components: {
        BoundsBackground: BoundsBackground === null ? undefined : _BoundsBackground,
        BoundsForeground: BoundsForeground === null ? undefined : _BoundsForeground,
        BoundsDetail: BoundsDetail === null ? undefined : _BoundsDetail,
        ContextBar,
      },
    }
  })

  React.useEffect(() => {
    const { ContextBar, BoundsBackground, BoundsForeground, BoundsDetail } = components

    autorun(() => {
      setCurrentContext({
        id,
        viewport,
        inputs,
        callbacks,
        meta,
        components: {
          BoundsBackground: BoundsBackground === null ? undefined : _BoundsBackground,
          BoundsForeground: BoundsForeground === null ? undefined : _BoundsForeground,
          BoundsDetail: BoundsDetail === null ? undefined : _BoundsDetail,
          ContextBar,
        },
      })
    })
  }, [])

  const context = getRendererContext<S>(id)

  return <context.Provider value={currentContext}>{children}</context.Provider>
})
