import {
  AUTH_START,
  AUTH_ERROR,
  AUTH_SET_TOKEN,
  AUTH_DONE,
  AUTH_LOGIN,
  AuthAction
} from './types'

export function authStart(): AuthAction {
  return {
    type: AUTH_START
  }
}

export function authError(error: string): AuthAction {
  return {
    type: AUTH_ERROR,
    error
  }
}

export function authSetToken(jwt: string): AuthAction {
  return {
    type: AUTH_SET_TOKEN,
    jwt
  }
}

export function authDone(): AuthAction {
  return {
    type: AUTH_DONE
  }
}

export function authLogin(): AuthAction {
  return {
    type: AUTH_LOGIN
  }
}
