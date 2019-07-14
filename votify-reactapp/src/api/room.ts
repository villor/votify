const apiBase = 'https://localhost:44378/api/';

export interface ApiPlayerState {
  paused: boolean
  duration: number
  position: number
  spotifyTrackId: string
  spotifyTrackName: string
  spotifyTrackArtist: string
  spotifyTrackImageUrl: string
}

export interface ApiTrack {
  trackId: number
  spotifyTrackId: string
  votes: number
}

export interface ApiRoom {
  roomId: number
  code: string
  ownerSpotifyId: string
  name: string
  tracks: ApiTrack[]
  playerState: ApiPlayerState | null
}

export async function getRoom(roomCode: string): Promise<ApiRoom> {
  return await fetch(apiBase + 'rooms/' + roomCode).then(r => r.json())
}

export async function addTrack(roomCode: string, spotifyTrackId: string): Promise<void> {
  await fetch(apiBase + 'rooms/' + roomCode + '/tracks', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ spotifyTrackId })
  })
}

export async function removeTrack(roomCode: string, trackId: number): Promise<void> {
  await fetch(apiBase + 'rooms/' + roomCode + '/tracks/' + trackId, {
    method: 'DELETE'
  })
}

export async function updatePlayerState(roomCode: string, playerState: ApiPlayerState): Promise<void> {
  await fetch(apiBase + 'rooms/' + roomCode + '/playerState', {
    method: 'PUT',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(playerState)
  })
}
