import { createSelector } from 'reselect'
import { AppState } from '..';

export const getSpotifyAccessToken = createSelector(
  (state: AppState) => state.auth,
  (auth) => auth.authenticated ? auth.claims!.spotifyAccessToken : (auth.clientCreds ? auth.clientCreds.accessToken : null)
)
