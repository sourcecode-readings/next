import * as React from 'react'
import { observer } from 'mobx-react-lite'
import { useRendererContext } from '~hooks'
import { BoundsUtils } from '~utils'
import type { TLBounds } from '~types'
import type { TLShape } from '~nu-lib'
import { useCounterScaledPosition } from '~hooks'

export interface TLBoundsDetailContainerProps<S extends TLShape> {
  hidden: boolean
  detail: 'size' | 'rotation'
  bounds: TLBounds
  shapes: S[]
}

export const BoundsDetailContainer = observer(function BoundsDetail<S extends TLShape>({
  bounds,
  hidden,
  shapes,
  detail = 'size',
}: TLBoundsDetailContainerProps<S>) {
  const {
    components: { BoundsDetail },
    viewport: {
      camera: { zoom },
    },
  } = useRendererContext()

  const rBounds = React.useRef<HTMLDivElement>(null)
  const scaledBounds = BoundsUtils.multiplyBounds(bounds, zoom)
  useCounterScaledPosition(rBounds, scaledBounds, zoom, 10003)

  if (!BoundsDetail) throw Error('Expected a BoundsDetail component.')

  return (
    <div
      ref={rBounds}
      className={`nu-counter-scaled-positioned ${hidden ? `nu-fade-out` : ''}`}
      aria-label="bounds-detail-container"
    >
      <BoundsDetail
        shapes={shapes}
        bounds={bounds}
        scaledBounds={scaledBounds}
        zoom={zoom}
        detail={detail}
      />
    </div>
  )
})
