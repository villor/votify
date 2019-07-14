import { put, takeLatest, call, take, race, select } from 'redux-saga/effects'
import * as signalR from '@aspnet/signalr';
import { eventChannel, END } from 'redux-saga';

import { HUB_CONNECTED, HUB_ADD_TRACK, HUB_REMOVE_TRACK, HUB_PLAYER_STATE, HUB_NEW_CONNECTION } from './types'
import { AUTH_SET_TOKEN, AuthSetTokenAction } from '../auth/types'
import { ROOM_JOINED, RoomJoinedAction } from '../room/types'
import { AppState } from '..';

const getRoomCode = (state: AppState): string | undefined => state.room.code

function hubChannel(conn: signalR.HubConnection) {
  return eventChannel(emit => {
    conn.on('AddTrack', track => {
      emit({ type: HUB_ADD_TRACK, track })
    })
    conn.on('RemoveTrack', trackId => {
      emit({ type: HUB_REMOVE_TRACK, trackId })
    })
    conn.on('PlayerState', playerState => {
      emit({ type: HUB_PLAYER_STATE, playerState })
    })
    conn.on('NewConnection', () => {
      emit({ type: HUB_NEW_CONNECTION })
    })

    conn.onclose((error?: Error) => {
      if (error) {
        emit(error)
      } else {
        emit(END)
      }
    })

    conn.start()
      .then(() => emit({ type: HUB_CONNECTED }))
      .catch((err: Error) => emit(err))

    return () => {
      conn.off('AddTrack')
    }
  })
}

function* hubSaga(action: AuthSetTokenAction) {
  const connection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:44378/roomHub', { accessTokenFactory: () => action.jwt })
      .build()
  const chan = yield call(hubChannel, connection)
  
  try {
    while (true) {
      const { hubAction, roomJoinedAction } = yield race({
        hubAction: take(chan),
        roomJoinedAction: take(ROOM_JOINED)
      })
      
      if (hubAction) {
        if (hubAction.type === HUB_CONNECTED) {
          const roomCode: ReturnType<typeof getRoomCode> = yield select(getRoomCode)
          if (roomCode) {
            connection.send('JoinRoom', roomCode)
          }
        }
        yield put(hubAction)
      } else if (connection.state === signalR.HubConnectionState.Connected) {
        connection.send('JoinRoom', (roomJoinedAction as RoomJoinedAction).room.code)
      }
    }
  } finally {
    chan.close()
    connection.stop()
  }
}

export default function* tokenWatcher() {
  yield takeLatest(AUTH_SET_TOKEN, hubSaga)
}
