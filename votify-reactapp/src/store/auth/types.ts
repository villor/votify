import { ApiSpotifyClientCredentials } from '../../api/auth'

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
  },
  clientCreds: ApiSpotifyClientCredentials | null
}

// Actions
export const AUTH_START = 'AUTH_START'
export const AUTH_ERROR = 'AUTH_ERROR'
export const AUTH_SET_TOKEN = 'AUTH_SET_TOKEN'
export const AUTH_SET_CLIENT_CREDS = 'AUTH_SET_CLIENT_CREDS'
export const AUTH_DONE = 'AUTH_DONE'
export const AUTH_LOGIN = 'AUTH_LOGIN'
export const AUTH_LOGOUT = 'AUTH_LOGOUT'

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

export interface AuthSetClientCredsAction {
  type: typeof AUTH_SET_CLIENT_CREDS
  clientCreds: ApiSpotifyClientCredentials
}

interface AuthDoneAction {
  type: typeof AUTH_DONE
}

interface AuthLoginAction {
  type: typeof AUTH_LOGIN
}

interface AuthLogoutAction {
  type: typeof AUTH_LOGOUT
}

export type AuthAction = AuthStartAction | AuthErrorAction | AuthSetTokenAction | AuthSetClientCredsAction | AuthDoneAction | AuthLoginAction | AuthLogoutAction
