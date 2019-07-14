import { ROOM_JOIN, ROOM_JOINED, RoomState, RoomAction, Track, ROOM_SPOTIFY_TRACKS, ROOM_ADD_TRACK, ROOM_REMOVE_TRACK, ROOM_PLAYER_STATE } from './types'
import { ApiTrack } from '../../api/room'

const initialState: RoomState = {
  loading: false,
  tracks: [],
  playerState: null,
  playerStateUpdated: new Date(),
}

const initTrack = (apiTrack: ApiTrack): Track => ({
  id: apiTrack.trackId,
  loading: true,
  votes: apiTrack.votes,
  spotifyTrackId: apiTrack.spotifyTrackId,
  spotifyTrack: null,
})

export default function roomReducer(
  state = initialState,
  action: RoomAction
): RoomState {
  switch (action.type) {
    case ROOM_JOIN:
      return {...state, code: action.code, loading: true }
    case ROOM_JOINED:
      return {
        ...state,
        loading: false,
        name: action.room.name,
        ownerSpotifyId: action.room.ownerSpotifyId,
        tracks: action.room.tracks.map(initTrack),
        playerState: action.room.playerState,
        playerStateUpdated: new Date(),
      }
    case ROOM_ADD_TRACK:
      return {
        ...state,
        tracks: [
          ...state.tracks,
          initTrack(action.track)
        ]
      }
    case ROOM_REMOVE_TRACK:
      return {
        ...state,
        tracks: state.tracks.filter(track => track.id !== action.trackId)
      }
    case ROOM_SPOTIFY_TRACKS:
      return {
        ...state,
        tracks: state.tracks.map(track => {
          for (const spotifyTrack of action.spotifyTracks) {
            if (spotifyTrack.id === track.spotifyTrackId) {
              return {
                ...track,
                loading: false,
                spotifyTrack
              }
            }
          }
          return track
        })
      }
    case ROOM_PLAYER_STATE:
      return { ...state, playerState: action.playerState, playerStateUpdated: new Date(), }
    default:
      return state
  }
}
