// Constants
const spotifyApiUrl = 'https://api.spotify.com/v1/'

// Types
export interface SpotifyExternalUrl {
  spotify: string
}

export interface SpotifyExternalId {
  isrc?: string
  ean?: string
  upc?: string
}

export interface SpotifyFollowers {
  href: string
  total: number
}

export interface SpotifyImage {
  height: number
  url: string
  width: number
}

export interface SpotifyRestrictions {
  reason: 'market'
}

export interface SpotifyCopyright {
  text: string
  type: 'C' | 'P'
}

export interface SpotifyPaging<T> {
  href: string
  items: T[]
  limit: number
  next: string
  offset: number
  previous: string
  total: number
}

export interface SpotifyTrackLink {
  external_urls: SpotifyExternalUrl
  href: string
  id: string
  type: 'track'
  uri: string
}

export interface SpotifyArtistSimplified {
  external_urls: SpotifyExternalUrl
  href: string
  id: string
  name: string
  type: 'artist'
  uri: string
}

export interface SpotifyArtist extends SpotifyArtistSimplified {
  followers: SpotifyFollowers
  genres: string[]
  images: SpotifyImage[]
  popularity: number
}

export interface SpotifyAlbumSimplified {
  album_group?: string
  album_type: string
  artists: SpotifyArtistSimplified[]
  available_markets: string[]
  external_urls: SpotifyExternalUrl
  href: string
  id: string
  images: SpotifyImage[]
  name: string
  release_date: string
  release_date_precision: 'year' | 'month' | 'day'
  restrictions?: SpotifyRestrictions
  type: 'album'
  uri: string
}

export interface SpotifyAlbum extends SpotifyAlbumSimplified {
  copyrights: SpotifyCopyright
  external_ids: SpotifyExternalId
  genres: string[]
  label: string
  popularity: number
  tracks: SpotifyPaging<SpotifyTrackSimplified>
}

export interface SpotifyTrackSimplified {
  artists: SpotifyArtistSimplified[]
  available_markets: string[]
  disc_number: number
  duration_ms: number
  explicit: boolean
  external_urls: SpotifyExternalUrl
  href: string
  id: string
  is_playable?: boolean
  linked_from?: SpotifyTrackLink
  restrictions?: SpotifyRestrictions
  name: string
  preview_url: string
  track_number: number
  type: 'track'
  uri: string
  is_local: boolean
}

export interface SpotifyTrack extends SpotifyTrackSimplified {
  album: SpotifyAlbumSimplified
  external_ids: SpotifyExternalId
  popularity: number
}

// Functions
export async function getSpotifyTracks(accessToken: string, trackIds: string[]): Promise<SpotifyTrack[]> {
  if (trackIds.length === 0)
    return []
  
  if (trackIds.length > 50)
    throw new Error('Can\'t fetch more than 50 tracks at a time.')

  const response = await fetch(spotifyApiUrl + 'tracks?ids=' + trackIds.join(','), {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + accessToken
    }
  }).then(r => r.json())

  return response.tracks
}

export async function searchTracks(
  accessToken: string,
  query: string,
  limit: number = 20,
  offset: number = 0
): Promise<SpotifyPaging<SpotifyTrack>> {
  const response = await fetch(spotifyApiUrl + `search?type=track&q=${encodeURIComponent(query)}&limit=${limit}&offset=${offset}`, {
    method: "GET",
    headers: {
      Authorization: "Bearer " + accessToken
    }
  }).then(r => r.json())
  
  return response.tracks
}

export async function playTrack(
  accessToken: string,
  deviceId: string,
  trackUri: string,
  position: number = 0,
): Promise<void> {
  await fetch(spotifyApiUrl + `me/player/play?device_id=${deviceId}`, {
      method: 'PUT',
      body: JSON.stringify({ uris: [trackUri], position_ms: position }),
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
      },
  });
}
