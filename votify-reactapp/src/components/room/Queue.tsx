import React from 'react'
import styled from 'styled-components'
import { useSelector } from 'react-redux'
import { getQueue } from '../../store/room/selectors'

import Track from './Track'

const StyledQueue = styled.div`
  max-width: 650px;
  margin: 40px auto;
`

export const Queue: React.FC = () => {
  const queue = useSelector(getQueue)

  return <StyledQueue>
    {queue.map(track => <Track key={track.id} spotifyTrack={track.spotifyTrack} />)}
  </StyledQueue>
}

export default Queue
