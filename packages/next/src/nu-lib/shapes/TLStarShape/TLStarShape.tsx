import * as React from 'react'
import { Vec } from '@tldraw/vec'
import { computed, makeObservable, observable } from 'mobx'
import { observer } from 'mobx-react-lite'
import { SVGContainer } from '~components'
import { BoundsUtils, PointUtils, PolygonUtils } from '~utils'
import { TLBoxShape, TLBoxShapeProps } from '../TLBoxShape'
import { intersectLineSegmentPolyline, intersectPolygonBounds } from '@tldraw/intersect'
import type { TLComponentProps, TLIndicatorProps, TLShapeProps } from '~nu-lib'
import type { TLBounds } from '~types'

export interface TLStarShapeProps extends TLBoxShapeProps {
  points: number
  ratio: number
}

export class TLStarShape<P extends TLStarShapeProps = any> extends TLBoxShape<P> {
  constructor(props = {} as TLShapeProps & Partial<P>) {
    super(props)
    this.init(props)
    makeObservable(this)
  }

  @observable points = 3
  @observable ratio = 1

  static id = 'star'

  Component = observer(({ events }: TLComponentProps) => {
    const {
      offset: [x, y],
    } = this

    return (
      <SVGContainer {...events}>
        <polygon
          transform={`translate(${x}, ${y})`}
          points={this.vertices.join()}
          stroke={'#000'}
          fill={'none'}
          strokeWidth={2}
          pointerEvents="all"
        />
      </SVGContainer>
    )
  })

  Indicator = observer((props: TLIndicatorProps) => {
    const {
      offset: [x, y],
    } = this

    return <polygon transform={`translate(${x}, ${y})`} points={this.vertices.join()} />
  })

  @computed get vertices() {
    return this.getVertices()
  }

  @computed get offset() {
    const {
      size: [w, h],
    } = this
    const center = BoundsUtils.getBoundsCenter(BoundsUtils.getBoundsFromPoints(this.vertices))
    return Vec.sub(Vec.div([w, h], 2), center)
  }

  @computed get pageVertices() {
    const { point, vertices } = this
    return vertices.map((vert) => Vec.add(vert, point))
  }

  getVertices(padding = 0): number[][] {
    const {
      ratio,
      points,
      size: [w, h],
    } = this

    // if (points === 3) {
    //   const A = [w / 2, padding / 2]
    //   const B = [w - padding, h - padding]
    //   const C = [padding / 2, h - padding]

    //   const centroid = PolygonUtils.getPolygonCentroid([A, B, C])

    //   const AB = Vec.med(A, B)
    //   const BC = Vec.med(B, C)
    //   const CA = Vec.med(C, A)

    //   const r = 1 - ratio

    //   const dAB = Vec.dist(AB, centroid) * r
    //   const dBC = Vec.dist(BC, centroid) * r
    //   const dCA = Vec.dist(CA, centroid) * r

    //   return [
    //     A,
    //     dAB ? Vec.nudge(AB, centroid, dAB) : AB,
    //     B,
    //     dBC ? Vec.nudge(BC, centroid, dBC) : BC,
    //     C,
    //     dCA ? Vec.nudge(CA, centroid, dCA) : CA,
    //   ]
    // }

    return PolygonUtils.getStarVertices(
      Vec.div([w, h], 2),
      [w - padding, h - padding],
      Math.round(points),
      ratio
    )
  }

  hitTestPoint = (point: number[]): boolean => {
    const { vertices } = this
    return PointUtils.pointInPolygon(Vec.add(point, this.point), vertices)
  }

  hitTestLineSegment = (A: number[], B: number[]): boolean => {
    const { vertices, point } = this
    return intersectLineSegmentPolyline(Vec.add(A, point), Vec.add(B, point), vertices).didIntersect
  }

  hitTestBounds = (bounds: TLBounds): boolean => {
    const { rotatedBounds, offset, vertices, point } = this
    const oBounds = BoundsUtils.translateBounds(bounds, Vec.neg(Vec.add(point, offset)))
    return (
      BoundsUtils.boundsContain(bounds, rotatedBounds) ||
      vertices.every((vert) => PointUtils.pointInBounds(vert, oBounds)) ||
      intersectPolygonBounds(vertices, oBounds).length > 0
    )
  }
}
