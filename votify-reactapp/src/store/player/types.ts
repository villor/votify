export interface PlayerState {
  ready: boolean
  deviceId: string
  error: string
}

export const PLAYER_INIT = 'PLAYER_INIT'
export const PLAYER_READY = 'PLAYER_READY'
export const PLAYER_NOT_READY = 'PLAYER_NOT_READY'
export const PLAYER_PLAY_NEXT = 'PLAYER_PLAY_NEXT'
export const PLAYER_STATE_CHANGED = 'PLAYER_STATE_CHANGED'
export const PLAYER_ERROR = 'PLAYER_ERROR'

export interface PlayerInitAction {
  type: typeof PLAYER_INIT
  name: string
}

export interface PlayerReadyAction {
  type: typeof PLAYER_READY
  deviceId: string
}

export interface PlayerNotReadyAction {
  type: typeof PLAYER_NOT_READY
}

export interface PlayerPlayNextAction {
  type: typeof PLAYER_PLAY_NEXT
}

export interface PlayerStateChangedAction {
  type: typeof PLAYER_STATE_CHANGED
  state: Spotify.PlaybackState
}

export interface PlayerErrorAction {
  type: typeof PLAYER_ERROR
  message: string
}

export type PlayerAction =
  | PlayerInitAction
  | PlayerReadyAction
  | PlayerNotReadyAction
  | PlayerPlayNextAction
  | PlayerStateChangedAction
  | PlayerErrorAction
