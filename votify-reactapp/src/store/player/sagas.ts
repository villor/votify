import { eventChannel, END } from 'redux-saga'
import { takeLatest, select, call, take, put, race, all, takeEvery, apply } from 'redux-saga/effects'
import { AppState } from '..';
import { AUTH_SET_TOKEN } from '../auth/types';
import {
  PlayerInitAction,
  PLAYER_INIT,
  PLAYER_ERROR,
  PLAYER_READY,
  PLAYER_NOT_READY,
  PLAYER_STATE_CHANGED,
  PLAYER_PLAY_NEXT,
  PlayerStateChangedAction
} from './types';
import { getQueue } from '../room/selectors'
import { Track } from '../room/types';
import { playTrack } from '../../api/spotify';
import { removeTrack, updatePlayerState } from '../../api/room';
import { HUB_NEW_CONNECTION } from '../hub/types';

declare var Spotify: any

const getAccessToken = (state: AppState): string => state.auth.claims!.spotifyAccessToken!
const getDeviceId = (state: AppState): string => state.player.deviceId
const getRoomCode = (state: AppState): string => state.room.code!

function playerChannel(player: Spotify.SpotifyPlayer) {
  return eventChannel(emit => {
    const onError: Spotify.ErrorListener = (err: Spotify.Error) => {
      emit({ type: PLAYER_ERROR, message: err.message })
      emit(END)
    }
    player.addListener('initialization_error', onError)
    player.addListener('authentication_error', onError)
    player.addListener('account_error', onError)
    player.addListener('playback_error', onError)

    player.addListener('ready', ({ device_id }) => emit({ type: PLAYER_READY, deviceId: device_id }))
    player.addListener('not_ready', ({ device_id }) => {
      emit({ type: PLAYER_ERROR, message: 'Player not ready' })
      emit(END)
    })

    player.addListener('player_state_changed', state => {
      if (state === null) {
        emit({ type: PLAYER_NOT_READY })
        emit(END)
        return
      }
      emit({ type: PLAYER_STATE_CHANGED, state })
    })

    player.connect()

    return () => {
      player.removeListener('initialization_error');
      player.removeListener('authentication_error');
      player.removeListener('account_error');
      player.removeListener('playback_error');
      player.removeListener('ready');
      player.removeListener('not_ready');
      player.removeListener('player_state_changed');
    }
  })
}

function* updatePlayerStateSaga(state: Spotify.PlaybackState) {
  const roomCode = yield select(getRoomCode)
  yield call(updatePlayerState, roomCode, {
    paused: state.paused,
    duration: state.duration,
    position: state.position,
    spotifyTrackId: state.track_window.current_track.uri.substr(14),
    spotifyTrackName: state.track_window.current_track.name,
    spotifyTrackArtist: state.track_window.current_track.artists[0].name,
    spotifyTrackImageUrl: state.track_window.current_track.album.images[0].url,
  })
}

function* playerFlow() {
  yield takeLatest(PLAYER_INIT, function* (action: PlayerInitAction) {
    let accessToken: ReturnType<typeof getAccessToken> = yield select(getAccessToken)
    const player = new Spotify.Player({
      name: action.name,
      getOAuthToken: (cb: any) => { cb(accessToken) }
    })
    const chan = yield call(playerChannel, player)
    
    let prevState: Spotify.PlaybackState | null = null
    try {
      while (true) {
        const { playerAction, hubNewConnectionAction } = yield race({
          playerAction: take(chan),
          hubNewConnectionAction: take(HUB_NEW_CONNECTION),
          authSetTokenAction: take(AUTH_SET_TOKEN)
        })

        if (playerAction) {
          if (playerAction.type === PLAYER_STATE_CHANGED) {
            const state: Spotify.PlaybackState = (playerAction as PlayerStateChangedAction).state
            if (prevState && prevState.paused && prevState.position !== 0
              && state.paused && state.position === 0) {
              yield put({ type: PLAYER_PLAY_NEXT })
            } else {
              yield call(updatePlayerStateSaga, state)
            }
            prevState = state            
          }
          yield put(playerAction)
        } else if (hubNewConnectionAction) {
          const state: Spotify.PlaybackState = yield apply(player, player.getCurrentState, [])
          yield call(updatePlayerStateSaga, state)
        } else {
          accessToken = yield select(getAccessToken)
        }
      }
    } finally {
      player.disconnect()
      chan.close()
    }
  })
}

function* watchPlayNext() {
  yield takeEvery(PLAYER_PLAY_NEXT, function* () {
    const queue: Track[] = yield select(getQueue)
    if (queue.length) {
      const nextTrack = queue[0]
      if (nextTrack.loading)
        return
      
      const accessToken = yield select(getAccessToken)
      const deviceId = yield select(getDeviceId)
      yield call(playTrack, accessToken, deviceId, nextTrack.spotifyTrack!.uri)

      const roomCode = yield select(getRoomCode)
      yield call(removeTrack, roomCode, nextTrack.id)
    }
  })
}

export default function* playerSaga() {
  yield all([
    playerFlow(),
    watchPlayNext(),
  ])
}