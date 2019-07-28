import React from 'react'
import styled from 'styled-components'
import { SpotifyTrack } from '../../api/spotify'

export interface TrackProps {
  spotifyTrack: SpotifyTrack | null
}

export const Track: React.FC<TrackProps> = ({ spotifyTrack, children }) => {
  const imgSrc = spotifyTrack ? spotifyTrack.album.images[0].url : ''
  const name = spotifyTrack ? spotifyTrack.name : 'Loading...'
  const artist = spotifyTrack ? spotifyTrack.artists[0].name : ''
  const album = spotifyTrack ? spotifyTrack.album.name : ''

  return <StyledTrack>
    <img src={imgSrc} alt={album} />
    <div className="track-info">
      <div>{name}</div>
      <div>{artist}</div>
    </div>
    <div>{children}</div>
  </StyledTrack>
}

const StyledTrack = styled.div`
  background: rgb(40,40,40);
  height: 64px;
  margin-bottom: 10px;
  display: flex;

  img {
    height: 100%;
  }

  .track-info {
    padding: 8px 15px;
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;

    div:first-child {
      font-size: 19px;
    }

    div:last-child {
      color: rgb(160,160,160);
    }
  }

  div:last-child {
    display: flex;
    align-items: center;
  }
`

export default Track;
