import { TLDotTool } from '@tldraw/next'
import { NuApp, Shape, NuDotShape } from 'stores'

export class NuDotTool extends TLDotTool<NuDotShape, Shape, NuApp> {
  static id = 'dot'
  static shortcut = 't,r,6'
  shapeClass = NuDotShape
}
