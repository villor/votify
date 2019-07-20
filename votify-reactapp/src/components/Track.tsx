import React from "react"
import { SpotifyTrack } from '../api/spotify'

export interface TrackProps {
  spotifyTrack: SpotifyTrack | null
  onClick?: () => void
}

export const Track: React.FC<TrackProps> = ({ spotifyTrack, onClick }) => {
  return <div className={"track" + (onClick ? " clickable" : "")} onClick={onClick}>
    {spotifyTrack ? (
      <div>
        <img src={spotifyTrack.album.images[0].url} alt={spotifyTrack.album.name} />
        <div className="track-names">
          <div>{spotifyTrack.name}</div>
          <div>{spotifyTrack.artists[0].name}</div>
        </div>
      </div>
     ) : (
      <p>Loading...</p>
     )}
  </div>
}

export default Track;
