import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppState } from '../store'
import { getQueue } from '../store/room/selectors'
import { addTrack } from '../api/room'
import TrackSearch from './TrackSearch'

interface RoomProps {
  code: string
}

export const Room: React.FC<RoomProps> = (props) => {
  const dispatch = useDispatch()
  const roomState = useSelector((state: AppState) => state.room)
  const queue = useSelector(getQueue)

  useEffect(() => {
    dispatch({ type: 'ROOM_JOIN', code: props.code })
  }, [props.code, dispatch])

  return <div>
    <button onClick={() => dispatch({ type: 'PLAYER_INIT', name: 'Votify' })}>PLAYER_INIT</button>
    <button onClick={() => dispatch({ type: 'PLAYER_PLAY_NEXT' })}>PLAY_NEXT</button>
    <button onClick={() => dispatch({ type: 'AUTH_LOGOUT', jwt: null })}>Log out</button>
    <button onClick={() => dispatch({ type: 'AUTH_REFRESH_TOKEN' })}>Refresh token</button>
    <div>Loading: {roomState.loading ? 'true' : 'false'}</div>
    <div>Code: {roomState.code}</div>
    <div>Name: {roomState.name}</div>
    <TrackSearch onSelectTrack={(spotifyTrackId: string) => { addTrack(roomState.code!, spotifyTrackId) }} />
    <h2>Queue:</h2>
    {queue.map(track => <div key={track.id}>
      {track.loading ? 'Loading...' : track.spotifyTrack!.name} - {track.votes} votes
    </div>)}
  </div>
}

export default Room;