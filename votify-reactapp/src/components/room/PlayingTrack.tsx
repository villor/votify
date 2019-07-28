import React from 'react'
import { ApiPlayerState } from '../../api/room'
import styled from 'styled-components';
import { msToMMSS } from '../../util/time'

interface PlayingTrackProps {
  playerState: ApiPlayerState | null
}

export const PlayingTrack: React.FC<PlayingTrackProps> = ({ playerState }) => {
  const render = () => {
    if (!playerState || !playerState.spotifyTrackId) {
      return <p>No track info</p>
    }
    return <React.Fragment>
      <Cover src={playerState.spotifyTrackImageUrl} />
      <TrackName>{playerState.spotifyTrackName}</TrackName>
      <Artist>{playerState.spotifyTrackArtist}</Artist>
      <PositionDuration>
        <div>{msToMMSS(playerState.position)}</div>
        <PositionDurationBar
          position={playerState.position}
          duration={playerState.duration} />
        <div>{msToMMSS(playerState.duration)}</div>
      </PositionDuration>
    </React.Fragment>
  }

  return <StyledPlayingTrack>
    {render()}
  </StyledPlayingTrack>
}

const StyledPlayingTrack =  styled.div`
  margin-top: 50px;
  text-align: center;
`

const Cover = styled.img`
  height: 300px;
  width: 300px;
`

const TrackName = styled.div`
  margin-top: 6px;
  font-size: 22px;
`

const Artist = styled.div`
  margin-top: 6px;
  font-size: 18px;
  color: rgb(160,160,160);
`

const PositionDuration = styled.div`
  display: flex;
  align-items: center;
  width: 350px;
  margin: 30px auto;
` 
interface PositionDurationBarProps {
  position: number
  duration: number
}
const PositionDurationBar = styled.div<PositionDurationBarProps>`
  flex: 1;
  margin: 0 15px;
  background: #aaa;
  height: 3px;
  position: relative;

  &::after {
    position: absolute;
    top: 0;
    left: 0;
    background: #eee;
    height: 100%;
    width: ${props => Math.floor(props.position / props.duration) + '%'};
  }
`

export default PlayingTrack
