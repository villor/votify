import React from 'react'
import styled from 'styled-components'
import { SpotifyTrack } from '../../api/spotify'

export interface TrackProps {
  spotifyTrack: SpotifyTrack | null,
  compact?: boolean,
}

export const Track: React.FC<TrackProps> = ({ spotifyTrack, compact, children }) => {
  const imgSrc = spotifyTrack ? spotifyTrack.album.images[0].url : ''
  const name = spotifyTrack ? spotifyTrack.name : 'Loading...'
  const artist = spotifyTrack ? spotifyTrack.artists[0].name : ''
  const album = spotifyTrack ? spotifyTrack.album.name : ''

  const Wrapper = compact ? StyledCompactTrack : StyledTrack
  return <Wrapper>
    <img src={imgSrc} alt={album} />
    <div className="track-info">
      <div>{name}</div>
      <div>{artist}</div>
    </div>
    <div>{children}</div>
  </Wrapper>
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
    overflow: hidden;

    div {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

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
    padding-right: 5px;
  }
`

const StyledCompactTrack = styled(StyledTrack)`
  height: 48px;
  margin: 0;
  font-size: 0.9em;

  &:nth-child(even) {
    background: rgb(35,35,35)
  }

  .track-info {
    padding: 4px 12px;
    div:first-child {
      font-size: 14px;
    }
    div:last-child {
      font-size: 13px;
    }
  }
`

export default Track
