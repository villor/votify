import { all, put, takeLatest, call, take, apply, select } from 'redux-saga/effects'
import { loginRedirect, checkPendingAuth, getTokenFromSpotifyCallback, refreshToken } from '../../api/auth'
import { eventChannel } from 'redux-saga';
import { AUTH_START, AUTH_SET_TOKEN, AUTH_ERROR, AUTH_DONE, AUTH_LOGIN, AUTH_LOGOUT } from './types';
import { AppState } from '..';

const getRefreshToken = (state: AppState) => state.auth.claims!.spotifyRefreshToken

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
  })
}

function* watchRefreshToken() {
  yield takeLatest('AUTH_REFRESH_TOKEN', function* () {
    const rToken: string = yield select(getRefreshToken)
    const jwt = yield call(refreshToken, rToken)
    yield put({ type: AUTH_SET_TOKEN, jwt })
    yield apply(window.localStorage, 'setItem', ['jwt', jwt])
  });
}

export default function* authSaga() {
  yield all([
    authFlow(),
    watchLogin(),
    watchLogout(),
    watchRefreshToken(),
  ])
}
