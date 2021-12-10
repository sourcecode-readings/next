/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react'
import {
  SVGContainer,
  TLComponentProps,
  TLDotShape,
  TLShapeProps,
  TLDotShapeProps,
} from '@tldraw/next'
import { observer } from 'mobx-react-lite'
import { makeObservable, observable } from 'mobx'
import type { NuStyleProps } from './NuStyleProps'

export interface NuDotShapeProps extends TLDotShapeProps, NuStyleProps {}

export class NuDotShape extends TLDotShape<NuDotShapeProps> {
  constructor(props = {} as TLShapeProps & Partial<NuDotShapeProps>) {
    super(props)
    this.init(props)
    makeObservable(this)
  }

  static id = 'dot'

  @observable stroke = '#000000'
  @observable fill = '#000000'
  @observable strokeWidth = 2

  Component = observer(({ events, isSelected }: TLComponentProps) => {
    const { radius, stroke, fill, strokeWidth } = this

    return (
      <SVGContainer {...events}>
        <circle
          className={isSelected ? 'nu-hitarea-fill' : 'nu-hitarea-stroke'}
          cx={radius}
          cy={radius}
          r={radius}
        />
        <circle
          cx={radius}
          cy={radius}
          r={radius}
          stroke={stroke}
          fill={fill}
          strokeWidth={strokeWidth}
          pointerEvents="all"
        />
      </SVGContainer>
    )
  })
}
