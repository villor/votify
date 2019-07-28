import React, { useState, useEffect, useRef} from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'

import useDebounce from '../../hooks/useDebounce'
import useOnClickOutside from '../../hooks/useOnClickOutside'
import Track from './Track'
import { SpotifyTrack, searchTracks } from '../../api/spotify'
import { getSpotifyAccessToken } from '../../store/auth/selectors'
import Button from '../common/Button'
import Input from '../common/Input';

export interface TrackSearchProps {
  onSelectTrack: (spotifyTrackId: string) => void
}

export const TrackSearch: React.FC<TrackSearchProps> = ({ onSelectTrack }) => {
  const ref = useRef(null)
  const accessToken = useSelector(getSpotifyAccessToken);

  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<SpotifyTrack[]>([]);
  const [isSearching, setIsSearching]= useState(false);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  useEffect(() => {
    if (debouncedSearchTerm) {
      setIsSearching(true);
      searchTracks(accessToken!, debouncedSearchTerm)
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

  useOnClickOutside(ref, () => {
    setResults([])
  })

  return <StyledTrackSearch ref={ref}>
    <SearchInput placeholder='Search tracks' onChange={e => setSearchTerm(e.target.value)} />
    {(results.length > 0 || isSearching) && <SearchResult>
      {results.map((track) => (
      <Track key={track.id} spotifyTrack={track}>
        <Button onClick={() => { onSelectTrack(track.id); }}>Add...</Button>
      </Track>
    ))}
    </SearchResult>}
  </StyledTrackSearch>
}

const StyledTrackSearch = styled.div`
  margin-left: auto;
  flex: 1;
  max-width: 500px;
  display: flex;
  position: relative;
`

const SearchInput = styled(Input)`
  margin-left: auto;
  &:focus {
    width: 100%;
  }
`

const SearchResult = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
`

export default TrackSearch;
