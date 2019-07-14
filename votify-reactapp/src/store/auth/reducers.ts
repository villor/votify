import jwt_decode from 'jwt-decode'
import {
  AuthState,
  AuthAction,
  AUTH_START,
  AUTH_ERROR,
  AUTH_SET_TOKEN,
  AUTH_DONE,
  AUTH_LOGIN,
} from './types'

const initialState: AuthState = {
  authenticated: false,
  loading: true
}

export default function authReducer(
  state = initialState,
  action: AuthAction
): AuthState {
  switch (action.type) {
    case AUTH_START:
      return {...state, loading: true}
    case AUTH_ERROR:
      return {...state, error: action.error}
    case AUTH_SET_TOKEN:
      if (action.jwt) {
        return {...state, authenticated: true, jwt: action.jwt, claims: jwt_decode(action.jwt)}
      }
      return {...state, authenticated: false, jwt: undefined, claims: undefined }
    case AUTH_DONE:
      return {...state, loading: false}
    case AUTH_LOGIN:
      return {...state, loading: true}
    default:
      return state
  }
}
