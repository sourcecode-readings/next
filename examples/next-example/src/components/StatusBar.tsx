/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react'
import { observer } from 'mobx-react-lite'
import { useAppContext } from '@tldraw/next'
import type { Shape } from 'stores'

export const StatusBar = observer(function StatusBar() {
  const app = useAppContext<Shape>()
  return (
    <div className="tl-debug">
      {app.selectedTool.id} | {app.selectedTool.currentState.id}
    </div>
  )
})
