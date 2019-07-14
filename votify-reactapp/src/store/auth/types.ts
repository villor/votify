// State
export interface AuthState {
  authenticated: boolean
  loading: boolean
  error?: string
  jwt?: string
  claims?: {
    aud: string
    exp: number
    iss: string
    spotifyAccessToken: string
    spotifyRefreshToken: string
    spotifyUserDisplayName: string
    spotifyUserId: string
    spotifyUserImageUrl: string
  }
}

// Actions
export const AUTH_START = 'AUTH_START'
export const AUTH_ERROR = 'AUTH_ERROR'
export const AUTH_SET_TOKEN = 'AUTH_SET_TOKEN'
export const AUTH_DONE = 'AUTH_DONE'
export const AUTH_LOGIN = 'AUTH_LOGIN'

interface AuthStartAction {
  type: typeof AUTH_START
}

interface AuthErrorAction {
  type: typeof AUTH_ERROR
  error: string
}

export interface AuthSetTokenAction {
  type: typeof AUTH_SET_TOKEN
  jwt: string
}

interface AuthDoneAction {
  type: typeof AUTH_DONE
}

interface AuthLoginAction {
  type: typeof AUTH_LOGIN
}

export type AuthAction = AuthStartAction | AuthErrorAction | AuthSetTokenAction | AuthDoneAction | AuthLoginAction
