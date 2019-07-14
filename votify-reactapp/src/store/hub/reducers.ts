import {
  HubState,
  HubAction,
  HUB_CONNECTED,
} from "./types";

const initialState: HubState = {
  connected: false,
  isConnecting: false,
  error: '',
}

export default function hubReducer(
  state = initialState,
  action: HubAction,
): HubState {
  switch (action.type) {
    case HUB_CONNECTED:
      return {
        ...state,
        connected: true
      }
    default:
      return state 
  }
}
