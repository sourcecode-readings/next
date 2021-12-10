/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react'
import { observer } from 'mobx-react-lite'
import type { TLAppPropsWithoutApp, TLAppPropsWithApp } from '~types'
import type { TLShape } from '~nu-lib'
import { AppContext, Renderer } from '~components'
import { useAppContext } from '~hooks'

export type AppProps<S extends TLShape> = TLAppPropsWithoutApp<S> | TLAppPropsWithApp<S>

export function App<S extends TLShape>(props: AppProps<S>): JSX.Element {
  return (
    <AppContext {...props}>
      <InnerApp {...props} />
    </AppContext>
  )
}

const InnerApp = observer(function InnerApp<S extends TLShape>(props: AppProps<S>): JSX.Element {
  const app = useAppContext<S>()
  return (
    <Renderer
      viewport={app.viewport}
      inputs={app.inputs}
      callbacks={app._events}
      brush={app.brush}
      hoveredShape={app.hoveredShape}
      selectedBounds={app.selectedBounds}
      selectedShapes={app.selectedShapes}
      shapes={app.shapesInViewport}
      showBounds={app.showBounds}
      showBoundsRotation={app.showBoundsRotation}
      showResizeHandles={app.showResizeHandles}
      showRotateHandle={app.showRotateHandle}
      showBoundsDetail={app.showBoundsDetail}
      showContextBar={app.showContextBar}
      {...props}
    />
  )
})
