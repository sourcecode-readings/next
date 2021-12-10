/* eslint-disable @typescript-eslint/no-explicit-any */
import { TLBoundsCorner, TLBoundsEdge } from '~types'

export const PI = Math.PI
export const TAU = PI / 2
export const PI2 = PI * 2
export const EPSILON = Math.PI / 180

export const FIT_TO_SCREEN_PADDING = 100

export const EMPTY_OBJECT: any = {}
export const EMPTY_ARRAY: any[] = []

export const CURSORS = {
  canvas: 'default',
  grab: 'grab',
  grabbing: 'grabbing',
  [TLBoundsCorner.TopLeft]: 'resize-nwse',
  [TLBoundsCorner.TopRight]: 'resize-nesw',
  [TLBoundsCorner.BottomRight]: 'resize-nwse',
  [TLBoundsCorner.BottomLeft]: 'resize-nesw',
  [TLBoundsEdge.Top]: 'resize-ns',
  [TLBoundsEdge.Right]: 'resize-ew',
  [TLBoundsEdge.Bottom]: 'resize-ns',
  [TLBoundsEdge.Left]: 'resize-ew',
}
