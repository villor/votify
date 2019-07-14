import { createSelector } from 'reselect'
import { orderBy } from 'lodash'
import { AppState } from '..';

export const getQueue = createSelector(
  (state: AppState) => state.room.tracks,
  tracks => orderBy(
    tracks,
    [t => t.votes, t => t.id],
    ['desc', 'asc']
  )
)
