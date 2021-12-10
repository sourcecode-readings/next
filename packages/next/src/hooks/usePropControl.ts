import * as React from 'react'
import type { TLAppPropsWithoutApp, TLAppPropsWithApp } from '~types'
import type { TLApp, TLShape } from '~nu-lib'

export function usePropControl<S extends TLShape, R extends TLApp<S> = TLApp<S>>(
  app: R,
  props: TLAppPropsWithoutApp<S> | TLAppPropsWithApp<S, R>
) {
  React.useEffect(() => {
    if (!('model' in props)) return
    if (props.model) app.history.deserialize(props.model)
  }, [(props as TLAppPropsWithoutApp<S>).model])
}
