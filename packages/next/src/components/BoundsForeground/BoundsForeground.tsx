import * as React from 'react'
import { observer } from 'mobx-react-lite'
import { TLBoundsComponentProps, TLBoundsCorner, TLBoundsEdge } from '~types'
import { EdgeHandle, CornerHandle, RotateHandle } from './handles'
import { SVGContainer } from '../SVGContainer'
import { useBoundsEvents } from '~hooks'
import type { TLShape } from '~nu-lib'

export const BoundsForeground = observer(function BoundsForeground<S extends TLShape>({
  bounds,
  zoom,
  showResizeHandles,
  showRotateHandle,
}: TLBoundsComponentProps<S>) {
  const { width, height } = bounds

  const size = 8 / zoom
  const targetSize = 6 / zoom

  const events = useBoundsEvents('center')

  return (
    <SVGContainer>
      <rect
        className="nu-bounds-fg"
        width={Math.max(width, 1)}
        height={Math.max(height, 1)}
        pointerEvents="none"
        {...events}
      />
      {showResizeHandles && (
        <>
          <EdgeHandle
            x={targetSize * 2}
            y={0}
            width={width - targetSize * 4}
            height={0}
            targetSize={targetSize}
            edge={TLBoundsEdge.Top}
          />
          <EdgeHandle
            x={width}
            y={targetSize * 2}
            width={0}
            height={height - targetSize * 4}
            targetSize={targetSize}
            edge={TLBoundsEdge.Right}
          />
          <EdgeHandle
            x={targetSize * 2}
            y={height}
            width={width - targetSize * 4}
            height={0}
            targetSize={targetSize}
            edge={TLBoundsEdge.Bottom}
          />
          <EdgeHandle
            x={0}
            y={targetSize * 2}
            width={0}
            height={height - targetSize * 4}
            targetSize={targetSize}
            edge={TLBoundsEdge.Left}
          />
          <CornerHandle
            cx={0}
            cy={0}
            size={size}
            targetSize={targetSize}
            corner={TLBoundsCorner.TopLeft}
          />
          <CornerHandle
            cx={width}
            cy={0}
            size={size}
            targetSize={targetSize}
            corner={TLBoundsCorner.TopRight}
          />
          <CornerHandle
            cx={width}
            cy={height}
            size={size}
            targetSize={targetSize}
            corner={TLBoundsCorner.BottomRight}
          />
          <CornerHandle
            cx={0}
            cy={height}
            size={size}
            targetSize={targetSize}
            corner={TLBoundsCorner.BottomLeft}
          />
        </>
      )}
      {showRotateHandle && (
        <RotateHandle cx={width / 2} cy={0 - targetSize * 2} size={size} targetSize={targetSize} />
      )}
    </SVGContainer>
  )
})
