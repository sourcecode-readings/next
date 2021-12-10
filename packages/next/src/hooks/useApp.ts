import * as React from 'react'
import type { TLAppPropsWithoutApp, TLAppPropsWithApp } from '~types'
import { TLApp, TLShape } from '~nu-lib'

export function useApp<S extends TLShape, R extends TLApp<S> = TLApp<S>>(
  props: TLAppPropsWithoutApp<S> | TLAppPropsWithApp<S, R>
): R {
  if ('app' in props) return props.app
  const [app] = React.useState<R>(
    () => new TLApp(props.model, props.shapeClasses, props.toolClasses) as R
  )
  return app
}
