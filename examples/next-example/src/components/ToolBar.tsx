/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react'
import { observer } from 'mobx-react-lite'
import type { Shape } from 'stores'
import { useAppContext } from '@tldraw/next'

export const ToolBar = observer(function ToolBar(): JSX.Element {
  const app = useAppContext<Shape>()

  const handleToolClick = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      const tool = e.currentTarget.dataset.tool
      if (tool) app.selectTool(tool)
    },
    [app]
  )

  const handleToolDoubleClick = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      const tool = e.currentTarget.dataset.tool
      if (tool) app.selectTool(tool)
      app.setToolLock(true)
    },
    [app]
  )

  const handleToolLockClick = React.useCallback(() => {
    app.setToolLock(!app.isToolLocked)
  }, [app])

  const zoomIn = React.useCallback(() => {
    app.zoomIn()
  }, [app])

  const zoomOut = React.useCallback(() => {
    app.zoomOut()
  }, [app])

  const resetZoom = React.useCallback(() => {
    app.resetZoom()
  }, [app])

  const zoomToFit = React.useCallback(() => {
    app.zoomToFit()
  }, [app])

  const zoomToSelection = React.useCallback(() => {
    app.zoomToSelection()
  }, [app])

  return (
    <div className="tl-toolbar">
      <input type="checkbox" checked={app.isToolLocked} onChange={handleToolLockClick} />
      {Array.from(app.children.values()).map((tool) => {
        const isActive = app.selectedTool === tool
        return (
          <button
            key={tool.id}
            data-tool={tool.id}
            onClick={handleToolClick}
            onDoubleClick={handleToolDoubleClick}
            style={{ textDecoration: isActive ? 'underline' : 'none' }}
          >
            {tool.id}
          </button>
        )
      })}
      Camera
      <button onClick={zoomOut}>-</button>
      <button onClick={zoomIn}>+</button>
      <button onClick={resetZoom}>reset</button>
      <button onClick={zoomToFit}>zoom to fit</button>
      <button onClick={zoomToSelection}>zoom to selection</button>
    </div>
  )
})
