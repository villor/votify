import { all, put, takeLatest, call, take } from 'redux-saga/effects'
import { loginRedirect, checkPendingAuth, getTokenFromSpotifyCallback } from '../../api/auth'

function* authFlow() {
  yield take('AUTH_START')
  try {
    if (yield call(checkPendingAuth))
      return

    const callbackToken = yield call(getTokenFromSpotifyCallback)
    if (callbackToken) {
      yield put({ type: 'AUTH_SET_TOKEN', jwt: callbackToken })
    }
  } catch (err) {
    yield put({ type: 'AUTH_ERROR', error: err.message })
  }
  yield put({ type: 'AUTH_DONE'})
}

function* watchLogin() {
  yield takeLatest('AUTH_LOGIN', function* login() {
    yield call(loginRedirect);
  })
}

export default function* authSaga() {
  yield all([
    authFlow(),
    watchLogin()
  ])
}
