import { TLBoxTool } from '@tldraw/next'
import { NuStarShape, Shape, NuApp } from 'stores'

export class NuStarTool extends TLBoxTool<NuStarShape, Shape, NuApp> {
  static id = 'star'
  shapeClass = NuStarShape
}
