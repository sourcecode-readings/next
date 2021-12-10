import * as React from 'react'
import { observer } from 'mobx-react-lite'
import { ToolBar } from './ToolBar'
import { StatusBar } from './StatusBar'

export const AppUI = observer(function AppUI() {
  return (
    <>
      <ToolBar />
      <StatusBar />
    </>
  )
})
