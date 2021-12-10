import { TLBoxTool } from '@tldraw/next'
import { NuPolygonShape, Shape, NuApp } from 'stores'

export class NuPolygonTool extends TLBoxTool<NuPolygonShape, Shape, NuApp> {
  static id = 'polygon'
  static shortcut = 'g,4'
  shapeClass = NuPolygonShape
}
