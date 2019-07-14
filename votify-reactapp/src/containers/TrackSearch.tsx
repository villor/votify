import React, { useState, useEffect} from 'react';
import { useSelector } from 'react-redux'
import { AppState } from '../store'
import useDebounce from '../hooks/useDebounce';
import Track from '../components/Track';
import { SpotifyTrack, searchTracks } from '../api/spotify';

export interface TrackSearchProps {
  onSelectTrack: (spotifyTrackId: string) => void
}

export const TrackSearch: React.FC<TrackSearchProps> = ({ onSelectTrack }) => {
  const accessToken = useSelector((state: AppState) => state.auth.claims!.spotifyAccessToken);

  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<SpotifyTrack[]>([]);
  const [isSearching, setIsSearching]= useState(false);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  useEffect(() => {
    if (debouncedSearchTerm) {
      setIsSearching(true);
      searchTracks(accessToken, debouncedSearchTerm)
        .then(searchResult => setResults(searchResult.items))
        .catch(err => {
          console.error(err)
          setResults([])
        })
        .finally(() => {
          setIsSearching(false);
        })
    } else {
      setResults([]);
    }
  }, [debouncedSearchTerm, accessToken])

  return (
    <div>
      <input placeholder='Search tracks' onChange={e => setSearchTerm(e.target.value)} />
      {isSearching && <div>Searching...</div>}
      {results.map((track) => (
        <Track key={track.id} name={track.name} artists={track.artists[0].name} onClick={() => { onSelectTrack(track.id); }} />
      ))}
    </div>
  )
}

export default TrackSearch;
