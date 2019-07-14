import { ApiRoom, ApiTrack, ApiPlayerState } from '../../api/room'
import { SpotifyTrack } from '../../api/spotify';

export interface Track {
  id: number
  votes: number
  loading: boolean
  spotifyTrackId: string
  spotifyTrack: SpotifyTrack | null
}

export interface RoomState {
  loading: boolean
  code?: string
  ownerSpotifyId?: string
  name?: string
  tracks: Track[]
  playerState: ApiPlayerState | null
  playerStateUpdated: Date
}

export const ROOM_JOIN = 'ROOM_JOIN'
export const ROOM_JOINED = 'ROOM_JOINED'
export const ROOM_ADD_TRACK = 'ROOM_ADD_TRACK'
export const ROOM_REMOVE_TRACK = 'ROOM_REMOVE_TRACK'
export const ROOM_SPOTIFY_TRACKS = 'ROOM_SPOTIFY_TRACKS'
export const ROOM_PLAYER_STATE = 'ROOM_PLAYER_STATE'

export interface RoomJoinAction {
  type: typeof ROOM_JOIN
  code: string
}

export interface RoomJoinedAction {
  type: typeof ROOM_JOINED
  room: ApiRoom
}

export interface RoomAddTrackAction {
  type: typeof ROOM_ADD_TRACK
  track: ApiTrack
}

export interface RoomRemoveTrackAction {
  type: typeof ROOM_REMOVE_TRACK
  trackId: number
}

export interface RoomSpotifyTracksAction {
  type: typeof ROOM_SPOTIFY_TRACKS
  spotifyTracks: any[]
}

export interface RoomPlayerStateAction {
  type: typeof ROOM_PLAYER_STATE
  playerState: ApiPlayerState
}

export type RoomAction = RoomJoinAction | RoomJoinedAction | RoomAddTrackAction | RoomRemoveTrackAction | RoomSpotifyTracksAction | RoomPlayerStateAction