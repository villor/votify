import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { AppState } from './store'
import {
  authStart,
  authLogin,
} from './store/auth/actions'

import Room from './containers/Room'

const App: React.FC = () => {
  const dispatch = useDispatch()
  const authState = useSelector((state: AppState) => state.auth)

  useEffect(() =>  {
    dispatch(authStart())
  }, [dispatch])

  if (authState.loading) {
    return <p>Loading...</p>;
  }

  if (!authState.authenticated) {
    return <p>Not logged in to spotify. Please <button onClick={() => { dispatch(authLogin()) }}>log in</button></p>;
  }

  return <Room code="fjert" />
}

export default App