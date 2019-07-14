import {
  PlayerState,
  PlayerAction,
  PLAYER_INIT,
  PLAYER_ERROR,
  PLAYER_READY,
  PLAYER_NOT_READY,
} from "./types";

const initialState: PlayerState = {
  ready: false,
  deviceId: '',
  error: '',
}

export default function playerReducer(
  state = initialState,
  action: PlayerAction,
): PlayerState {
  switch (action.type) {
    case PLAYER_INIT:
      return {
        ...state,
        ready: false,
      }
    case PLAYER_ERROR:
      return {
        ...state,
        ready: false,
        error: action.message,
      }
    case PLAYER_READY:
      return {
        ...state,
        ready: true,
        deviceId: action.deviceId
      }
    case PLAYER_NOT_READY:
      return {
        ...state,
        deviceId: '',
        ready: false,
      }
    default:
      return state 
  }
}
