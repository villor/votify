import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppState } from '../../store'
import { addTrack } from '../../api/room'
import Button from '../common/Button'
import TrackSearch from './TrackSearch'
import Queue from './Queue'
import PlayingTrack from './PlayingTrack'
import styled from 'styled-components';

interface RoomProps {
  code: string
}

const TopSection = styled.div`
  display: flex;
  align-items: center;
`

export const Room: React.FC<RoomProps> = (props) => {
  const dispatch = useDispatch()
  const roomState = useSelector((state: AppState) => state.room)
  const authState = useSelector((state: AppState) => state.auth)

  useEffect(() => {
    dispatch({ type: 'ROOM_JOIN', code: props.code })
  }, [props.code, dispatch])

  return <React.Fragment>
    <TopSection>
      {authState.authenticated && <React.Fragment>
        <Button onClick={() => dispatch({ type: 'AUTH_LOGOUT' })}>Log out</Button>
        <Button onClick={() => dispatch({ type: 'PLAYER_INIT', name: 'Votify' })}>Init player</Button>
        <Button onClick={() => dispatch({ type: 'PLAYER_PLAY_NEXT' })}>Play next</Button>
      </React.Fragment>}
      {!authState.authenticated && <Button onClick={() => dispatch({ type: 'AUTH_LOGIN' })}>Log in</Button>}
      
      <TrackSearch onSelectTrack={(spotifyTrackId: string) => { addTrack(roomState.code!, spotifyTrackId) }} />
    </TopSection>
    <PlayingTrack playerState={roomState.playerState} lastUpdate={roomState.playerStateUpdated}/>
    <Queue />
  </React.Fragment>
}

export default Room;