import * as React from 'react'
import { makeObservable, observable } from 'mobx'
import { observer } from 'mobx-react-lite'
import { SVGContainer } from '~components'
import { TLShape, TLShapeProps } from '../../TLShape'
import { BoundsUtils } from '~utils'
import type { TLBounds } from '~types'
import type { TLComponentProps, TLIndicatorProps, TLResizeInfo } from '~nu-lib'

export interface TLDotShapeProps {
  radius: number
}

export class TLDotShape<P extends TLDotShapeProps = any> extends TLShape<P> {
  constructor(props = {} as TLShapeProps & Partial<P>) {
    super(props)
    this.init(props)
    makeObservable(this)
  }

  static id = 'dot'

  @observable radius = 4

  readonly hideBounds = true
  readonly hideResizeHandles = true
  readonly hideRotateHandle = true
  readonly hideBoundsDetail = true

  Component = observer(({ events }: TLComponentProps) => {
    const { radius } = this

    return (
      <SVGContainer {...events}>
        <circle
          cx={radius}
          cy={radius}
          r={radius}
          stroke={'#000'}
          fill={'#000'}
          pointerEvents="all"
        />
      </SVGContainer>
    )
  })

  Indicator = observer((props: TLIndicatorProps) => {
    const { radius } = this
    return <circle cx={radius} cy={radius} r={radius} />
  })

  getBounds = (): TLBounds => {
    const {
      point: [x, y],
      radius,
    } = this
    return {
      minX: x,
      minY: y,
      maxX: x + radius * 2,
      maxY: y + radius * 2,
      width: radius * 2,
      height: radius * 2,
    }
  }

  getRotatedBounds = (): TLBounds => {
    return BoundsUtils.getBoundsFromPoints(
      BoundsUtils.getRotatedCorners(this.bounds, this.rotation)
    )
  }

  onResize = (bounds: TLBounds, info: TLResizeInfo<P>): this => {
    const { radius } = this
    return this.update({
      point: [bounds.minX + bounds.width / 2 - radius, bounds.minY + bounds.height / 2 - radius],
    })
  }
}
