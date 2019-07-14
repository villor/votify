import { all, put, takeLatest, call, apply, take } from 'redux-saga/effects'

const apiBase = 'https://localhost:44378/api/';

function* authFlow() {
  yield take('AUTH_START')

  const pendingAuth = JSON.parse(window.localStorage.getItem('spotifyPendingAuth') || 'null');
  const spotifyCallback = JSON.parse(window.localStorage.getItem('spotifyCallback') || 'null');

  if (pendingAuth) {
    window.localStorage.removeItem('spotifyPendingAuth');

    const urlParams = new URLSearchParams(window.location.search);
    window.localStorage.setItem('spotifyCallback', JSON.stringify({
      code: urlParams.get('code'),
      error: urlParams.get('error') || (urlParams.get('state') !== pendingAuth.state ? 'state_mismatch' : null)
    }));

    window.location.replace(pendingAuth.origin);
  } else if (spotifyCallback) {
    window.localStorage.removeItem('spotifyCallback');
    if (spotifyCallback.error) {
      yield put({ type: 'AUTH_ERROR', error: spotifyCallback.error })
    } else {
      const tokenResponse = yield call(fetch, apiBase + 'token/request', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          code: spotifyCallback.code,
          redirectUri: 'http://localhost:3000/callback'
        })
      })
      const tokenData = yield apply(tokenResponse, tokenResponse.json, [])
      yield put({ type: 'AUTH_SET_TOKEN', jwt: tokenData.token })
    }
  }
  yield put({ type: 'AUTH_DONE'})
}

function* watchLogin() {
  yield takeLatest('AUTH_LOGIN', function* login() {
    const tokenInfoResponse = yield call(fetch, apiBase + 'token/info')
    const tokenInfo = yield apply(tokenInfoResponse, tokenInfoResponse.json, [])
    const state = Math.random().toString(36).substring(2, 15)
    window.localStorage.setItem('spotifyPendingAuth', JSON.stringify({
      state: state,
      origin: window.location.href
    }))
    const redirectUri = 'http%3A%2F%2Flocalhost%3A3000%2Fcallback'
    const scope = encodeURIComponent(tokenInfo.scope)
    window.location.href = `https://accounts.spotify.com/authorize?client_id=${tokenInfo.clientId}&response_type=code&redirect_uri=${redirectUri}&state=${state}&scope=${scope}`
  })
}

export default function* authSaga() {
  yield all([
    authFlow(),
    watchLogin()
  ])
}
