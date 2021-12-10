/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react'
import {
  SVGContainer,
  TLComponentProps,
  TLBoxShape,
  TLShapeProps,
  TLBoxShapeProps,
} from '@tldraw/next'
import { observer } from 'mobx-react-lite'
import { makeObservable, observable } from 'mobx'
import type { NuStyleProps } from './NuStyleProps'

export interface NuBoxShapeProps extends TLBoxShapeProps, NuStyleProps {}

export class NuBoxShape extends TLBoxShape<NuBoxShapeProps> {
  constructor(props = {} as TLShapeProps & Partial<NuBoxShapeProps>) {
    super(props)
    this.init(props)
    makeObservable(this)
  }

  static id = 'box'

  @observable stroke = '#000000'
  @observable fill = '#ffffff22'
  @observable strokeWidth = 2

  Component = observer(({ events, isSelected }: TLComponentProps) => {
    const {
      size: [w, h],
      stroke,
      fill,
      strokeWidth,
    } = this

    return (
      <SVGContainer {...events}>
        <rect
          className={isSelected ? 'nu-hitarea-fill' : 'nu-hitarea-stroke'}
          x={strokeWidth / 2}
          y={strokeWidth / 2}
          width={Math.max(0.01, w - strokeWidth)}
          height={Math.max(0.01, h - strokeWidth)}
          pointerEvents="all"
        />
        <rect
          x={strokeWidth / 2}
          y={strokeWidth / 2}
          width={Math.max(0.01, w - strokeWidth)}
          height={Math.max(0.01, h - strokeWidth)}
          strokeWidth={strokeWidth}
          stroke={stroke}
          fill={fill}
        />
      </SVGContainer>
    )
  })
}
