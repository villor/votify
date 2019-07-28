import React, { useState } from 'react'
import { ApiPlayerState } from '../../api/room'
import styled from 'styled-components';
import { msToMMSS } from '../../util/time'
import useInterval from '../../hooks/useInterval';

interface PlayingTrackProps {
  playerState: ApiPlayerState | null
  lastUpdate: Date
}

export const PlayingTrack: React.FC<PlayingTrackProps> = ({ playerState, lastUpdate }) => {
  const [calculatedPosition, setCalculatedPosition] = useState(playerState ? playerState.position : null)
  useInterval(() => {
    if (!playerState)
      return
    setCalculatedPosition(playerState.paused ? playerState.position : playerState.position + (Number(new Date()) - Number(lastUpdate)))
  }, !playerState || playerState.paused ? null : 1000)

  if (!playerState || !playerState.spotifyTrackId) {
    return <StyledPlayingTrack><p>No track info</p></StyledPlayingTrack>
  }

  return <StyledPlayingTrack>
    <Cover src={playerState.spotifyTrackImageUrl} />
    <TrackName>{playerState.spotifyTrackName}</TrackName>
    <Artist>{playerState.spotifyTrackArtist}</Artist>
    <PositionDuration>
      <div>{msToMMSS(calculatedPosition!)}</div>
      <PositionDurationBar
        position={calculatedPosition!}
        duration={playerState.duration} />
      <div>{msToMMSS(playerState.duration)}</div>
    </PositionDuration>
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
    content: ' ';
    position: absolute;
    top: 0;
    left: 0;
    background: #eee;
    height: 100%;
    width: ${props => Math.floor(props.position / props.duration) + '%'};
  }
`

export default PlayingTrack
