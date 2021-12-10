/* eslint-disable @typescript-eslint/no-explicit-any */
import { action, makeObservable, observable } from 'mobx'
import type {
  TLOnTransition,
  TLCallbacks,
  TLKeyboardHandler,
  TLOnEnter,
  TLOnExit,
  TLPinchHandler,
  TLPointerHandler,
  TLShortcut,
  TLWheelHandler,
  TLStateEvents,
  AnyObject,
} from '~types'
import type { TLShape } from '~nu-lib'
import { KeyUtils } from '~utils'

export interface TLStateClass<
  S extends TLShape,
  R extends TLRootState<S> = TLRootState<S>,
  P extends R | TLState<S, R, any> = any
> {
  new (parent: P, root: R): TLState<S, R>
  id: string
}

export abstract class TLRootState<S extends TLShape> implements Partial<TLCallbacks<S>> {
  constructor() {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const id = this.constructor['id'] as string

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const initial = this.constructor['initial'] as string | undefined

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const states = this.constructor['states'] as TLStateClass<S>[]

    this._id = id
    this._initial = initial
    this._states = states
  }

  private _id: string
  private _initial?: string
  private _states: TLStateClass<S, any, any>[]
  private _isActive = false

  get initial() {
    return this._initial
  }

  get states() {
    return this._states
  }

  get id() {
    return this._id
  }

  get isActive(): boolean {
    return this._isActive
  }

  get descendants(): (TLState<S, any, any> | this)[] {
    return Array.from(this.children.values()).flatMap((state) => [state, ...state.descendants])
  }

  /* ------------------ Child States ------------------ */

  children = new Map<string, TLState<S, any, any>>([])

  registerStates = (...stateClasses: TLStateClass<S, any>[]): void => {
    stateClasses.forEach((StateClass) =>
      this.children.set(StateClass.id, new StateClass(this, this))
    )
  }

  deregisterStates = (...states: TLStateClass<S, any>[]): void => {
    states.forEach((StateClass) => {
      this.children.get(StateClass.id)?.dispose()
      this.children.delete(StateClass.id)
    })
  }

  @observable currentState: TLState<S, any, any> = {} as TLState<S, any, any>

  @action setCurrentState(state: TLState<S, any, any>) {
    this.currentState = state
  }

  /**
   * Transition to a new active state.
   *
   * @param id The id of the new active state.
   * @param data (optional) Any data to send to the new active state's `onEnter` method.
   */
  transition = (id: string, data: AnyObject = {}) => {
    if (this.children.size === 0)
      throw Error(`Tool ${this.id} has no states, cannot transition to ${id}.`)
    const nextState = this.children.get(id)
    const prevState = this.currentState
    if (!nextState) throw Error(`Could not find a state named ${id}.`)
    if (this.currentState) {
      prevState._events.onExit({ ...data, toId: id })
      this.setCurrentState(nextState)
      this._events.onTransition({ ...data, fromId: prevState.id, toId: id })
      nextState._events.onEnter({ ...data, fromId: prevState.id })
    } else {
      this.currentState = nextState
      nextState._events.onEnter({ ...data, fromId: '' })
    }
  }

  /* --------------- Keyboard Shortcuts --------------- */

  protected registerKeyboardShortcuts = (): void => {
    if (!this.shortcuts?.length) return

    this.disposables.push(
      ...this.shortcuts.map(({ keys, fn }) =>
        KeyUtils.registerShortcut(keys, () => {
          if (!this.isActive) return
          fn(this, this)
        })
      )
    )
  }

  protected disposables: (() => void)[] = []

  dispose() {
    this.disposables.forEach((disposable) => disposable())
    return this
  }

  /* ----------------- Internal Events ---------------- */

  private forwardEvent = <
    K extends keyof TLStateEvents<S>,
    A extends Parameters<TLStateEvents<S>[K]>
  >(
    eventName: keyof TLStateEvents<S>,
    ...args: A
  ) => {
    if (this.currentState?._events?.[eventName]) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      this.currentState._events?.[eventName](...args)
    }
  }

  _events: TLStateEvents<S> = {
    /**
     * Handle the change from inactive to active.
     *
     * @param info The previous state and any info sent via the transition.
     */
    onTransition: (info) => {
      this.onTransition?.(info)
    },

    /**
     * Handle the change from inactive to active.
     *
     * @param info The previous state and any info sent via the transition.
     */
    onEnter: (info) => {
      this._isActive = true
      if (this.initial) this.transition(this.initial, info)
      this.onEnter?.(info)
    },

    /**
     * Handle the change from active to inactive.
     *
     * @param info The next state and any info sent via the transition.
     */
    onExit: (info) => {
      this._isActive = false
      this.currentState?.onExit?.({ fromId: 'parent' })
      this.onExit?.(info)
    },

    /**
     * Respond to wheel events forwarded to the state by its parent. Run the current active child
     * state's handler, then the state's own handler.
     *
     * @param info The event info from TLInputs.
     * @param event The DOM event.
     */
    onWheel: (info, gesture, event) => {
      this.onWheel?.(info, gesture, event)
      this.forwardEvent('onWheel', info, gesture, event)
    },

    /**
     * Respond to pointer down events forwarded to the state by its parent. Run the current active
     * child state's handler, then the state's own handler.
     *
     * @param info The event info from TLInputs.
     * @param event The DOM event.
     */
    onPointerDown: (info, event) => {
      this.onPointerDown?.(info, event)
      this.forwardEvent('onPointerDown', info, event)
    },

    /**
     * Respond to pointer up events forwarded to the state by its parent. Run the current active
     * child state's handler, then the state's own handler.
     *
     * @param info The event info from TLInputs.
     * @param event The DOM event.
     */
    onPointerUp: (info, event) => {
      this.onPointerUp?.(info, event)
      this.forwardEvent('onPointerUp', info, event)
    },

    /**
     * Respond to pointer move events forwarded to the state by its parent. Run the current active
     * child state's handler, then the state's own handler.
     *
     * @param info The event info from TLInputs.
     * @param event The DOM event.
     */
    onPointerMove: (info, event) => {
      this.onPointerMove?.(info, event)
      this.forwardEvent('onPointerMove', info, event)
    },

    /**
     * Respond to pointer enter events forwarded to the state by its parent. Run the current active
     * child state's handler, then the state's own handler.
     *
     * @param info The event info from TLInputs.
     * @param event The DOM event.
     */
    onPointerEnter: (info, event) => {
      this.onPointerEnter?.(info, event)
      this.forwardEvent('onPointerEnter', info, event)
    },

    /**
     * Respond to pointer leave events forwarded to the state by its parent. Run the current active
     * child state's handler, then the state's own handler.
     *
     * @param info The event info from TLInputs.
     * @param event The DOM event.
     */
    onPointerLeave: (info, event) => {
      this.onPointerLeave?.(info, event)
      this.forwardEvent('onPointerLeave', info, event)
    },

    /**
     * Respond to key down events forwarded to the state by its parent. Run the current active child
     * state's handler, then the state's own handler.
     *
     * @param info The event info from TLInputs.
     * @param event The DOM event.
     */
    onKeyDown: (info, event) => {
      this._events.handleModifierKey(info, event)
      this.onKeyDown?.(info, event)
      this.forwardEvent('onKeyDown', info, event)
    },

    /**
     * Respond to key up events forwarded to the state by its parent. Run the current active child
     * state's handler, then the state's own handler.
     *
     * @param info The event info from TLInputs.
     * @param event The DOM event.
     */
    onKeyUp: (info, event) => {
      this._events.handleModifierKey(info, event)
      this.onKeyUp?.(info, event)
      this.forwardEvent('onKeyUp', info, event)
    },

    /**
     * Respond to pinch start events forwarded to the state by its parent. Run the current active
     * child state's handler, then the state's own handler.
     *
     * @param info The event info from TLInputs.
     * @param gesture The gesture info from useGesture.
     * @param event The DOM event.
     */
    onPinchStart: (info, gesture, event) => {
      this.onPinchStart?.(info, gesture, event)
      this.forwardEvent('onPinchStart', info, gesture, event)
    },

    /**
     * Respond to pinch events forwarded to the state by its parent. Run the current active child
     * state's handler, then the state's own handler.
     *
     * @param info The event info from TLInputs.
     * @param gesture The gesture info from useGesture.
     * @param event The DOM event.
     */
    onPinch: (info, gesture, event) => {
      this.onPinch?.(info, gesture, event)
      this.forwardEvent('onPinch', info, gesture, event)
    },

    /**
     * Respond to pinch end events forwarded to the state by its parent. Run the current active
     * child state's handler, then the state's own handler.
     *
     * @param info The event info from TLInputs.
     * @param gesture The gesture info from useGesture.
     * @param event The DOM event.
     */
    onPinchEnd: (info, gesture, event) => {
      this.onPinchEnd?.(info, gesture, event)
      this.forwardEvent('onPinchEnd', info, gesture, event)
    },

    /**
     * When a modifier key is pressed, treat it as a pointer move.
     *
     * @private
     * @param info The event info from TLInputs.
     * @param event The DOM event.
     */
    handleModifierKey: (info, event) => {
      switch (event.key) {
        case 'Shift':
        case 'Alt':
        case 'Ctrl':
        case 'Meta': {
          this._events.onPointerMove(info, event)
          break
        }
      }
    },
  }

  /* ----------------- For Subclasses ----------------- */

  static id: string

  shortcuts?: TLShortcut<S>[]

  onEnter?: TLOnEnter<any>

  onExit?: TLOnExit<any>

  onTransition?: TLOnTransition<any>

  onWheel?: TLWheelHandler<S>

  onPointerDown?: TLPointerHandler<S>

  onPointerUp?: TLPointerHandler<S>

  onPointerMove?: TLPointerHandler<S>

  onPointerEnter?: TLPointerHandler<S>

  onPointerLeave?: TLPointerHandler<S>

  onKeyDown?: TLKeyboardHandler<S>

  onKeyUp?: TLKeyboardHandler<S>

  onPinchStart?: TLPinchHandler<S>

  onPinch?: TLPinchHandler<S>

  onPinchEnd?: TLPinchHandler<S>
}

export abstract class TLState<
  S extends TLShape,
  R extends TLRootState<S>,
  P extends R | TLState<S, any> = any
> extends TLRootState<S> {
  constructor(parent: P, root: R) {
    super()
    this._parent = parent
    this._root = root

    if (this.states && this.states.length > 0) {
      this.registerStates(...this.states)
      const initialId = this.initial ?? this.states[0].id
      const state = this.children.get(initialId)
      if (state) {
        this.setCurrentState(state)
        this.currentState?._events.onEnter({ fromId: 'initial' })
      }
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const shortcut = this.constructor['shortcut'] as string

    if (shortcut) {
      KeyUtils.registerShortcut(shortcut, () => {
        this.parent.transition(this.id)
      })
    }

    this.registerKeyboardShortcuts()

    makeObservable(this)
  }

  /* --------------- Keyboard Shortcuts --------------- */

  protected registerKeyboardShortcuts = () => {
    if (!this.shortcuts?.length) return

    this.disposables.push(
      ...this.shortcuts.map(({ keys, fn }) =>
        KeyUtils.registerShortcut(keys, () => {
          if (!this.isActive) return
          fn(this.root, this)
        })
      )
    )
  }

  protected _root: R
  protected _parent: P

  get root() {
    return this._root
  }

  get parent() {
    return this._parent
  }

  get ascendants(): (P | TLState<S, R>)[] {
    if (!this.parent) return [this]
    if (!('ascendants' in this.parent)) return [this.parent, this]
    return [...this.parent.ascendants, this]
  }

  children = new Map<string, TLState<S, R, any>>([])

  registerStates = (...stateClasses: TLStateClass<S, R, this>[]): void => {
    stateClasses.forEach((StateClass) =>
      this.children.set(StateClass.id, new StateClass(this, this._root))
    )
  }

  deregisterStates = (...states: TLStateClass<S, R, this>[]): void => {
    states.forEach((StateClass) => {
      this.children.get(StateClass.id)?.dispose()
      this.children.delete(StateClass.id)
    })
  }
}
