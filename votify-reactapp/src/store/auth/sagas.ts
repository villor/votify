import { all, put, takeLatest, call, take, apply, select, delay } from 'redux-saga/effects'
import { loginRedirect, checkPendingAuth, getTokenFromSpotifyCallback, refreshToken, getClientCredentials } from '../../api/auth'
import { eventChannel } from 'redux-saga';
import { AUTH_START, AUTH_SET_TOKEN, AUTH_SET_CLIENT_CREDS, AUTH_ERROR, AUTH_DONE, AUTH_LOGIN, AUTH_LOGOUT, AuthSetTokenAction, AuthSetClientCredsAction } from './types';
import { AppState } from '..';
import { getRandomInteger } from '../../util/number';

const getRefreshToken = (state: AppState) => state.auth.claims!.spotifyRefreshToken
const getTokenExpiry = (state: AppState) => state.auth.claims!.exp

function* updateClientCredentials() {
  const clientCreds = yield call(getClientCredentials)
  yield put({ type: AUTH_SET_CLIENT_CREDS, clientCreds })
}

function localStorageTokenChannel() {
  return eventChannel(emit => {
    const listener = (e: StorageEvent) => {
      if (e.key === 'jwt' && e.oldValue !== e.newValue) {
        emit({ jwt: e.newValue})
      }
    }
    window.addEventListener('storage', listener)
    return () => {
      window.removeEventListener('storage', listener)
    }
  })
}

function* authFlow() {
  yield take(AUTH_START)
  try {
    if (yield call(checkPendingAuth))
      return

    const callbackToken = yield call(getTokenFromSpotifyCallback)
    const localStorageToken = yield apply(window.localStorage, 'getItem', ['jwt'])
    if (callbackToken) {
      yield put({ type: AUTH_SET_TOKEN, jwt: callbackToken })
      yield apply(window.localStorage, 'setItem', ['jwt', callbackToken])
    } else if (localStorageToken) {
      yield put({ type: AUTH_SET_TOKEN, jwt: localStorageToken })
    } else {
      yield call(updateClientCredentials);
    }
  } catch (err) {
    yield put({ type: AUTH_ERROR, error: err.message })
  }
  yield put({ type: AUTH_DONE})

  const tokenChan = yield call(localStorageTokenChannel)
  while (true) {
    const { jwt } = yield take(tokenChan)
    yield put({ type: AUTH_SET_TOKEN, jwt })
  }
}

function* watchLogin() {
  yield takeLatest(AUTH_LOGIN, function* login() {
    yield call(loginRedirect);
  })
}

function* watchLogout() {
  yield takeLatest(AUTH_LOGOUT, function* logout() {
    yield put({ type: AUTH_SET_TOKEN, jwt: null })
    yield apply(window.localStorage, 'removeItem', ['jwt'])
    yield call(updateClientCredentials)
  })
}

function* refreshTokenSaga() {
  const rToken: string = yield select(getRefreshToken)
  const jwt = yield call(refreshToken, rToken)
  yield put({ type: AUTH_SET_TOKEN, jwt })
  yield apply(window.localStorage, 'setItem', ['jwt', jwt])
}

function* watchSetToken() {
  yield takeLatest(AUTH_SET_TOKEN, function* (action: AuthSetTokenAction) {
    if (action.jwt) {
      const tokenExpiry: number = yield select(getTokenExpiry)
      const now = Math.floor(new Date().getTime() / 1000)
      const waitTime = Math.max(0, tokenExpiry - now - getRandomInteger(0, 600))
      console.log(waitTime)
      yield delay(waitTime * 1000)
      yield call(refreshTokenSaga)
    }
  })
}

function* watchSetClientCreds() {
  yield takeLatest(AUTH_SET_CLIENT_CREDS, function* (action: AuthSetClientCredsAction) {
    const expiry = Math.floor(new Date(action.clientCreds.exp).getTime() / 1000)
    const now = Math.floor(new Date().getTime() / 1000)
    const waitTime = Math.max(0, expiry - now - getRandomInteger(0, 600))
    yield delay(waitTime * 1000)
    
    const authenticated = yield select((state: AppState) => state.auth.authenticated)
    if (!authenticated) {
      yield call(updateClientCredentials)
    }
  })
}

export default function* authSaga() {
  yield all([
    authFlow(),
    watchLogin(),
    watchLogout(),
    watchSetToken(),
    watchSetClientCreds(),
  ])
}
