import { observer } from 'mobx-react-lite'
import * as React from 'react'
import { useBoundsEvents } from '~hooks/useBoundsEvents'
import { TLBoundsCorner } from '~types'

const cornerBgClassnames = {
  [TLBoundsCorner.TopLeft]: 'nu-cursor-nwse',
  [TLBoundsCorner.TopRight]: 'nu-cursor-nesw',
  [TLBoundsCorner.BottomRight]: 'nu-cursor-nwse',
  [TLBoundsCorner.BottomLeft]: 'nu-cursor-nesw',
}

interface CornerHandleProps {
  cx: number
  cy: number
  size: number
  targetSize: number
  corner: TLBoundsCorner
  isHidden?: boolean
}

export const CornerHandle = observer(function CornerHandle({
  cx,
  cy,
  size,
  targetSize,
  corner,
  isHidden,
}: CornerHandleProps): JSX.Element {
  const events = useBoundsEvents(corner)

  return (
    <g opacity={isHidden ? 0 : 1}>
      <rect
        className={'nu-transparent ' + (isHidden ? '' : cornerBgClassnames[corner])}
        aria-label={`${corner} target`}
        x={cx - targetSize * 1.25}
        y={cy - targetSize * 1.25}
        width={targetSize * 2.5}
        height={targetSize * 2.5}
        pointerEvents={isHidden ? 'none' : 'all'}
        {...events}
      />
      <rect
        className="nu-corner-handle"
        aria-label={`${corner} handle`}
        x={cx - size / 2}
        y={cy - size / 2}
        width={size}
        height={size}
        pointerEvents="none"
      />
    </g>
  )
})
