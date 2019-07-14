import { all, select, call, put, takeLatest, takeEvery } from 'redux-saga/effects'
import { AppState } from '../'
import { ROOM_JOIN, ROOM_JOINED, RoomJoinAction, ROOM_SPOTIFY_TRACKS, ROOM_ADD_TRACK, ROOM_REMOVE_TRACK, ROOM_PLAYER_STATE } from './types'
import { HUB_ADD_TRACK, HubAddTrackAction, HUB_REMOVE_TRACK, HubRemoveTrackAction, HubPlayerStateAction, HUB_PLAYER_STATE } from '../hub/types'
import { getSpotifyTracks } from '../../api/spotify'
import { getRoom, ApiRoom } from '../../api/room'
import { chunk } from '../../util/array'

const getAccessToken = (state: AppState): string => state.auth.claims!.spotifyAccessToken!

function* requestSpotifyTracks(spotifyTrackIds: string[]) {
  const accessToken: ReturnType<typeof getAccessToken> = yield select(getAccessToken)
  for (const trackIds of chunk(spotifyTrackIds, 50)) {
    const spotifyTracks = yield call(getSpotifyTracks, accessToken, trackIds)
    if (spotifyTracks.length) {
      yield put({ type: ROOM_SPOTIFY_TRACKS, spotifyTracks })
    }
  }
}

function* roomJoin(action: RoomJoinAction) {
  const room: ApiRoom = yield call(getRoom, action.code)
  yield put({ type: ROOM_JOINED, room })
  
  if (room.tracks.length) {
    yield requestSpotifyTracks(room.tracks.map(track => track.spotifyTrackId))
  }
}

function* watchRoomJoin() {
  yield takeLatest(ROOM_JOIN, roomJoin)
}

function* watchHubAddTrack() {
  yield takeEvery(HUB_ADD_TRACK, function* (action: HubAddTrackAction) {
    yield put({ type: ROOM_ADD_TRACK, track: action.track })
    yield requestSpotifyTracks([action.track.spotifyTrackId])
  })
}

function* watchHubRemoveTrack() {
  yield takeEvery(HUB_REMOVE_TRACK, function* (action: HubRemoveTrackAction) {
    yield put({ type: ROOM_REMOVE_TRACK, trackId: action.trackId })
  })
}

function* watchHubPlayerState() {
  yield takeLatest(HUB_PLAYER_STATE, function* (action: HubPlayerStateAction) {
    yield put({ type: ROOM_PLAYER_STATE, playerState: action.playerState })
  })
}

export default function* roomSaga() {
  yield all([
    watchRoomJoin(),
    watchHubAddTrack(),
    watchHubRemoveTrack(),
    watchHubPlayerState(),
  ])
}
