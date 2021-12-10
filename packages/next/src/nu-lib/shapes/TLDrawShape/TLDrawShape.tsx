import * as React from 'react'
import { Vec } from '@tldraw/vec'
import { computed, makeObservable, observable } from 'mobx'
import { TLShape, TLShapeProps } from '~nu-lib/TLShape'
import { BoundsUtils } from '~utils'
import { observer } from 'mobx-react-lite'
import { SVGContainer } from '~components'
import type { TLBounds } from '~types'
import type { TLComponentProps, TLIndicatorProps, TLResizeInfo } from '~nu-lib'

export interface TLDrawShapeProps {
  points: number[][]
  isComplete: boolean
}

export class TLDrawShape<P extends TLDrawShapeProps = any> extends TLShape<P> {
  constructor(props = {} as TLShapeProps & Partial<P>) {
    super(props)
    this.init(props)
    makeObservable(this)
  }

  static id = 'draw'

  @observable points: number[][] = []
  @observable isComplete = false

  Component = observer(({ events }: TLComponentProps) => {
    const { points } = this

    return (
      <SVGContainer {...events}>
        <polyline
          points={points.join()}
          stroke={'#000'}
          fill={'none'}
          strokeWidth={2}
          pointerEvents="all"
        />
      </SVGContainer>
    )
  })

  Indicator = observer((props: TLIndicatorProps) => {
    const { points } = this
    return <polyline points={points.join()} fill="transparent" />
  })

  /** The shape's bounds in "shape space". */
  @computed get pointBounds(): TLBounds {
    const { points } = this
    return BoundsUtils.getBoundsFromPoints(points)
  }

  /** The shape's bounds in "page space". */
  getBounds = (): TLBounds => {
    const { pointBounds, point } = this
    return BoundsUtils.translateBounds(pointBounds, point)
  }

  /** The shape's rotated points in "shape space". */
  @computed get rotatedPoints(): number[][] {
    const { points, center, rotation } = this
    if (!this.rotation) return points
    return points.map((point) => Vec.rotWith(point, center, rotation))
  }

  /** The shape's rotated bounds in "page space". */
  getRotatedBounds = (): TLBounds => {
    const { rotatedPoints } = this
    if (!this.rotation) return this.bounds
    return BoundsUtils.translateBounds(BoundsUtils.getBoundsFromPoints(rotatedPoints), this.point)
  }

  /**
   * A snapshot of the shape's points normalized against its bounds. For performance and memory
   * reasons, this property must be set manually with `setNormalizedPoints`.
   */
  normalizedPoints: number[][] = []
  isResizeFlippedX = false
  isResizeFlippedY = false

  /** Prepare the shape for a resize session. */
  onResizeStart = () => {
    const { bounds, points } = this
    const size = [bounds.width, bounds.height]
    this.normalizedPoints = points.map((point) => Vec.divV(point, size))
  }

  /**
   * Resize the shape to fit a new bounding box.
   *
   * @param bounds
   * @param info
   */
  onResize = (bounds: TLBounds, info: TLResizeInfo<P>) => {
    const size = [bounds.width, bounds.height]
    const flipX = info.scaleX < 0
    const flipY = info.scaleY < 0

    this.update({
      point: [bounds.minX, bounds.minY],
      points: this.normalizedPoints.map((point) => {
        if (flipX) point = [1 - point[0], point[1]]
        if (flipY) point = [point[0], 1 - point[1]]
        return Vec.mulV(point, size).concat(point[2])
      }),
    })
    return this
  }
}
