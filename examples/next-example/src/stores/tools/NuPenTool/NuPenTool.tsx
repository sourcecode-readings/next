import { TLDrawTool } from '@tldraw/next'
import { NuPenShape, Shape, NuApp } from 'stores'

export class NuPenTool extends TLDrawTool<NuPenShape, Shape, NuApp> {
  static id = 'pen'
  static shortcut = 'd,p,5'
  shapeClass = NuPenShape
  simplify = false
}
