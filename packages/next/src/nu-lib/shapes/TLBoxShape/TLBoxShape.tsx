import * as React from 'react'
import { makeObservable, observable } from 'mobx'
import { observer } from 'mobx-react-lite'
import { SVGContainer } from '~components'
import { TLShape, TLShapeProps } from '../../TLShape'
import { BoundsUtils } from '~utils'
import type { TLBounds } from '~types'
import type { TLComponentProps, TLIndicatorProps, TLResizeInfo } from '~nu-lib'

export interface TLBoxShapeProps {
  size: number[]
}

export class TLBoxShape<P extends TLBoxShapeProps = any> extends TLShape<P & TLBoxShapeProps> {
  constructor(props = {} as TLShapeProps & Partial<P & TLBoxShapeProps>) {
    super(props)
    this.init(props)
    makeObservable(this)
  }

  static id = 'box'

  @observable size: number[] = [100, 100]

  Component = observer(({ events }: TLComponentProps) => {
    const {
      size: [w, h],
    } = this

    return (
      <SVGContainer {...events}>
        <rect
          width={Math.max(0.01, w)}
          height={Math.max(0.01, h)}
          stroke={'#000'}
          fill={'none'}
          strokeWidth={2}
          pointerEvents="all"
        />
      </SVGContainer>
    )
  })

  Indicator = observer((props: TLIndicatorProps) => {
    return <rect width={this.size[0]} height={this.size[1]} fill="transparent" />
  })

  getBounds = (): TLBounds => {
    const [x, y] = this.point
    const [width, height] = this.size
    return {
      minX: x,
      minY: y,
      maxX: x + width,
      maxY: y + height,
      width,
      height,
    }
  }

  getRotatedBounds = (): TLBounds => {
    return BoundsUtils.getBoundsFromPoints(
      BoundsUtils.getRotatedCorners(this.bounds, this.rotation)
    )
  }

  onResize = (bounds: TLBounds, info: TLResizeInfo<P>): this => {
    return this.update({
      point: [bounds.minX, bounds.minY],
      size: [Math.max(1, bounds.width), Math.max(1, bounds.height)],
    })
  }
}
