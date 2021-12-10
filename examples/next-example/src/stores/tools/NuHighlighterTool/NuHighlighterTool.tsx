import { TLDrawTool } from '@tldraw/next'
import { NuHighlighterShape, Shape, NuApp } from 'stores'

export class NuHighlighterTool extends TLDrawTool<NuHighlighterShape, Shape, NuApp> {
  static id = 'highlighter'
  static shortcut = 'h'
  shapeClass = NuHighlighterShape
  simplify = true
  simplifyTolerance = 0.618
}
