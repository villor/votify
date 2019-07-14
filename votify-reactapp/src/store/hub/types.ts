import { ApiTrack, ApiPlayerState } from "../../api/room";

export interface HubState {
  connected: boolean
  isConnecting: boolean
  error: string
}

export const HUB_CONNECTED = 'HUB_CONNECTED'
export const HUB_ADD_TRACK = 'HUB_ADD_TRACK'
export const HUB_REMOVE_TRACK = 'HUB_REMOVE_TRACK'
export const HUB_PLAYER_STATE = 'HUB_PLAYER_STATE'
export const HUB_NEW_CONNECTION = 'HUB_NEW_CONNECTION'

export interface HubConnectedAction {
  type: typeof HUB_CONNECTED
}

export interface HubAddTrackAction {
  type: typeof HUB_ADD_TRACK
  track: ApiTrack
}

export interface HubRemoveTrackAction {
  type: typeof HUB_REMOVE_TRACK
  trackId: number
}

export interface HubPlayerStateAction {
  type: typeof HUB_PLAYER_STATE
  playerState: ApiPlayerState
}

export interface HubNewConnectionAction {
  type: typeof HUB_NEW_CONNECTION
}

export type HubAction = HubConnectedAction | HubAddTrackAction | HubRemoveTrackAction | HubPlayerStateAction | HubNewConnectionAction
