/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  intersectLineSegmentBounds,
  intersectLineSegmentPolyline,
  intersectPolygonBounds,
} from '@tldraw/intersect'
import { action, computed, makeObservable, observable } from 'mobx'
import type { AnyObject, TLBounds, TLBoundsCorner, TLBoundsEdge, TLHandle } from '~types'
import { BoundsUtils, PointUtils, assignOwnProps } from '~utils'
import { deepCopy } from '~utils/DataUtils'

export interface TLShapeClass<S extends TLShape = TLShape> {
  new (props: any): S
  id: string
}

export interface TLIndicatorProps<M = unknown> {
  meta: M
  isEditing: boolean
  isBinding: boolean
  isHovered: boolean
  isSelected: boolean
}

export interface TLShapeProps {
  id: string
  parentId: string
  point: number[]
  rotation?: number
  name?: string
  children?: string[]
  handles?: Record<string, TLHandle>
  isGhost?: boolean
  isHidden?: boolean
  isLocked?: boolean
  isGenerated?: boolean
  isAspectRatioLocked?: boolean
}

export type TLSerializedShape<P = AnyObject> = TLShapeProps & {
  type: string
  nonce?: number
} & P

export interface TLComponentProps<M = unknown> extends TLIndicatorProps<M> {
  events: {
    onPointerMove: React.PointerEventHandler
    onPointerDown: React.PointerEventHandler
    onPointerUp: React.PointerEventHandler
    onPointerEnter: React.PointerEventHandler
    onPointerLeave: React.PointerEventHandler
    onKeyUp: React.KeyboardEventHandler
    onKeyDown: React.KeyboardEventHandler
  }
}

export interface TLResizeInfo<P = any> {
  type: TLBoundsEdge | TLBoundsCorner
  scaleX: number
  scaleY: number
  transformOrigin: number[]
  initialBounds: TLBounds
  initialProps: TLShapeProps & P
}

export abstract class TLShape<P extends AnyObject = any, M = any> implements TLShapeProps {
  constructor(props: TLShapeProps & Partial<P>) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.type = this.constructor['id']
    this.init(props)
    makeObservable(this)
  }

  static type: string

  protected propsKeys = new Set<string>([
    'type',
    'nonce',
    'parentId',
    'point',
    'name',
    'rotation',
    'children',
    'handles',
    'isGhost',
    'isHidden',
    'isLocked',
    'isGenerated',
    'isAspectRatioLocked',
  ])

  readonly showCloneHandles: boolean = false
  readonly hideResizeHandles: boolean = false
  readonly hideRotateHandle: boolean = false
  readonly hideContextBar: boolean = false
  readonly hideBoundsDetail: boolean = false
  readonly hideBounds: boolean = false
  readonly isStateful: boolean = false
  readonly type: string
  readonly id: string = 'id'
  nonce = 0
  isDirty = false
  private lastSerialized = {} as TLSerializedShape<P>

  @observable parentId = 'parentId'
  @observable point: number[] = [0, 0]
  @observable name?: string = 'Shape'
  @observable rotation?: number
  @observable children?: string[]
  @observable handles?: Record<string, TLHandle>
  @observable isGhost?: boolean
  @observable isHidden?: boolean
  @observable isLocked?: boolean
  @observable isGenerated?: boolean
  @observable isAspectRatioLocked?: boolean

  abstract Component: (props: TLComponentProps<M>) => JSX.Element | null

  abstract Indicator: (props: TLIndicatorProps<M>) => JSX.Element | null

  abstract getBounds: () => TLBounds

  protected init = (props: TLShapeProps & Partial<P>) => {
    assignOwnProps(this, props)
    Object.keys(props).forEach((key) => this.propsKeys.add(key))
    this.lastSerialized = this.getSerialized()
    makeObservable(this)
  }

  getCenter = () => {
    return BoundsUtils.getBoundsCenter(this.bounds)
  }

  getRotatedBounds = () => {
    const { bounds, rotation } = this
    if (!rotation) return bounds
    return BoundsUtils.getBoundsFromPoints(BoundsUtils.getRotatedCorners(bounds, rotation))
  }

  hitTestPoint = (point: number[]): boolean => {
    const ownBounds = this.rotatedBounds

    if (!this.rotation) {
      return PointUtils.pointInBounds(point, ownBounds)
    }

    const corners = BoundsUtils.getRotatedCorners(ownBounds, this.rotation)

    return PointUtils.pointInPolygon(point, corners)
  }

  hitTestLineSegment = (A: number[], B: number[]): boolean => {
    const box = BoundsUtils.getBoundsFromPoints([A, B])
    const { rotatedBounds, rotation = 0 } = this

    return BoundsUtils.boundsContain(rotatedBounds, box) || rotation
      ? intersectLineSegmentPolyline(A, B, BoundsUtils.getRotatedCorners(this.bounds)).didIntersect
      : intersectLineSegmentBounds(A, B, rotatedBounds).length > 0
  }

  hitTestBounds = (bounds: TLBounds): boolean => {
    const { rotatedBounds, rotation = 0 } = this
    const corners = BoundsUtils.getRotatedCorners(this.bounds, rotation)
    return (
      BoundsUtils.boundsContain(bounds, rotatedBounds) ||
      intersectPolygonBounds(corners, bounds).length > 0
    )
  }

  onResize = (bounds: TLBounds, info: TLResizeInfo<P>) => {
    this.update({ point: [bounds.minX, bounds.minY] })
    return this
  }

  onResizeStart?: () => void

  @computed get center(): number[] {
    return this.getCenter()
  }

  @computed get bounds(): TLBounds {
    return this.getBounds()
  }

  @computed get rotatedBounds(): TLBounds {
    return this.getRotatedBounds()
  }

  /**
   * Get a new serialized copy of the shape.
   *
   * ```tsx
   * myShape.getSerialized()
   * ```
   *
   * @returns The new serialized shape.
   * @public
   */
  getSerialized = (): TLSerializedShape<P> => {
    const propKeys = Array.from(this.propsKeys.values()) as (keyof typeof this)[]
    return deepCopy(
      Object.fromEntries(propKeys.map((key) => [key, this[key]]))
    ) as TLSerializedShape<P>
  }

  /**
   * Get a serialized copy of the shape. This method will return a cached copy unless the shape has changed.
   *
   * ```tsx
   * myShape.getCachedSerialized()
   * ```
   *
   * @private
   * @returns The serialized shape.
   */
  protected getCachedSerialized = (): TLSerializedShape<P> => {
    if (this.isDirty) {
      this.nonce++
      this.isDirty = false
      this.lastSerialized = this.getSerialized()
    }
    return this.lastSerialized
  }

  /**
   * Get a serialized copy of the shape.
   *
   * ```tsx
   * example
   * ```
   *
   * @returns The serialized shape.
   * @public
   */
  get serialized(): TLSerializedShape<P> {
    return this.getCachedSerialized()
  }

  /**
   * Update the shape with new properties.
   *
   * ```tsx
   * myShape.update({ size: [200, 200] })
   * ```
   *
   * @returns The shape instance.
   * @public
   */
  @action update = (props: Partial<TLShapeProps | P>, isDeserializing = false) => {
    if (!(isDeserializing || this.isDirty)) this.isDirty = true
    Object.assign(this, props)
    return this
  }
}
