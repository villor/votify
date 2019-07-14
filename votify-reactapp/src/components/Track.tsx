import React from "react";

export interface TrackProps {
  name: string
  artists: string
  onClick: () => void
}

export const Track: React.FC<TrackProps> = (props) => {
  return <div onClick={props.onClick}>
    <div>{props.name} - {props.artists}</div>
  </div>
}

export default Track;
