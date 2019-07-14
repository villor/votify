const apiBase = 'https://localhost:44304/api/'

/**
 * Adds a pending authorization to the session storage and redirects the user to the Spotify authorization page
 */
export function loginRedirect(): void {
  fetch(apiBase + 'token/info')
    .then(r => r.json())
    .then(tokenInfo => {
      const state = Math.random().toString(36).substring(2, 15)
      window.sessionStorage.setItem('spotifyPendingAuth', JSON.stringify({
        state: state,
        origin: window.location.href
      }))
      const redirectUri = 'http%3A%2F%2Flocalhost%3A3000%2Fcallback'
      const scope = encodeURIComponent(tokenInfo.scope)
      window.location.href = `https://accounts.spotify.com/authorize?client_id=${tokenInfo.clientId}&response_type=code&redirect_uri=${redirectUri}&state=${state}&scope=${scope}`
    })
}

/**
 * Checks session storage to see if there is a pending spotify authorization
 * If an authorization is pending, the code/error from the Spotify callback are saved to session storage and the user is redirected to the saved origin url
 * @returns true if there was a pending auth and the user will be redirected, otherwise false
 */
export function checkPendingAuth(): boolean {
  const pendingAuth = JSON.parse(window.sessionStorage.getItem('spotifyPendingAuth') || 'null')
  if (pendingAuth) {
    window.sessionStorage.removeItem('spotifyPendingAuth')

    const urlParams = new URLSearchParams(window.location.search);
    window.sessionStorage.setItem('spotifyCallback', JSON.stringify({
      code: urlParams.get('code'),
      error: urlParams.get('error') || (urlParams.get('state') !== pendingAuth.state ? 'state_mismatch' : null)
    }));

    window.location.replace(pendingAuth.origin)
    return true
  }
  return false
}

/**
 * Checks session storage to see if a Spotify callback is saved to session storage by checkPendingAuth()
 * If a callback is found, a token is requested from the Votify api and returned
 * @returns A promise containing the jwt token, or null if no callback was found
 */ 
export async function getTokenFromSpotifyCallback(): Promise<string | null> {
  const spotifyCallback = JSON.parse(window.sessionStorage.getItem('spotifyCallback') || 'null')
  if (spotifyCallback) {
    window.sessionStorage.removeItem('spotifyCallback')
    if (spotifyCallback.error) {
      throw new Error('Spotify callback error: ' + spotifyCallback.error)
    } else {
      const tokenData = await fetch(apiBase + 'token/request', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          code: spotifyCallback.code,
          redirectUri: 'http://localhost:3000/callback'
        })
      }).then(r => r.json())
      return tokenData.token
    }
  }
  return null
}

export async function refreshToken(refreshToken: string): Promise<string> {
  const tokenData = await fetch(apiBase + 'token/refresh?refreshToken=' + refreshToken, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  }).then(r => r.json())
  return tokenData.token
}
