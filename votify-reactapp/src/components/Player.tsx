import React from 'react'
import { ApiPlayerState } from '../api/room'

interface PlayerProps {
  playerState: ApiPlayerState
}

export const Player: React.FC<PlayerProps> = ({ playerState }) => {
  return <div>
  </div>
}

export default Player
