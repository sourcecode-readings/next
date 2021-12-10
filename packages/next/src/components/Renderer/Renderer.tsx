import * as React from 'react'
import type { TLShape } from '~nu-lib'
import type { TLRendererProps } from '~types'
import { Canvas, RendererContext } from '~components'

export function Renderer<S extends TLShape>({
  viewport,
  inputs,
  callbacks,
  components,
  ...rest
}: TLRendererProps<S>) {
  return (
    <RendererContext
      id={rest.id}
      viewport={viewport}
      inputs={inputs}
      callbacks={callbacks}
      components={components}
      meta={rest.meta}
    >
      <Canvas {...rest} />
    </RendererContext>
  )
}
