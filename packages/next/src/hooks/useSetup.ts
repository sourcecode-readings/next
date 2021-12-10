import * as React from 'react'
import type { TLSubscriptionCallback } from '~types'
import type { TLApp, TLShape } from '~nu-lib'

declare const window: Window & { tln: TLApp<any> }

export function useSetup<S extends TLShape, R extends TLApp<S>>(
  app: R,
  onMount: TLSubscriptionCallback<S, R, 'mount'>,
  onPersist: TLSubscriptionCallback<S, R, 'persist'>
) {
  React.useLayoutEffect(() => {
    const unsubs: (() => void)[] = []
    if (!app) return
    app.history.reset()
    if (typeof window !== undefined) window['tln'] = app
    if (onMount) onMount(app, null)
    if (onPersist) unsubs.push(app.subscribe('persist', onPersist))
    return () => {
      unsubs.forEach((unsub) => unsub())
      app.dispose()
    }
  }, [app, onMount, onPersist])
}
