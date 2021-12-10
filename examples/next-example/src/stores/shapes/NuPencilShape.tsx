/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react'
import {
  assignOwnProps,
  SVGContainer,
  SvgPathUtils,
  TLComponentProps,
  TLDrawShape,
  TLDrawShapeProps,
  TLIndicatorProps,
  TLShapeProps,
} from '@tldraw/next'
import { observer } from 'mobx-react-lite'
import { observable, computed, makeObservable } from 'mobx'
import type { NuStyleProps } from './NuStyleProps'

export interface NuPencilShapeProps extends TLDrawShapeProps, NuStyleProps {}

export class NuPencilShape extends TLDrawShape<NuPencilShapeProps> {
  constructor(props = {} as TLShapeProps & Partial<NuPencilShapeProps>) {
    super(props)
    assignOwnProps(this, props)
    makeObservable(this)
  }

  static id = 'pencil'

  @observable stroke = '#000000'
  @observable fill = '#ffffff22'
  @observable strokeWidth = 2

  @computed get pointsPath() {
    const { points } = this
    return SvgPathUtils.getCurvedPathForPoints(points)
  }

  Component = observer(({ events }: TLComponentProps) => {
    const { pointsPath, stroke, fill, strokeWidth } = this

    return (
      <SVGContainer {...events}>
        <polyline
          points={pointsPath}
          stroke={stroke}
          fill={fill}
          strokeWidth={strokeWidth}
          pointerEvents="all"
        />
      </SVGContainer>
    )
  })

  Indicator = observer((props: TLIndicatorProps) => {
    const { pointsPath } = this
    return <path d={pointsPath} fill="none" />
  })
}
