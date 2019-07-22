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

  const render = () => {
    if (authState.loading) {
      return <p>Loading...</p>;
    }

    return <div>
        {authState.authenticated ? <button onClick={() => dispatch({ type: 'AUTH_LOGOUT', jwt: null })}>Log out</button> : <button onClick={() => { dispatch(authLogin()) }}>Log in</button>}
        <Room code="fjert" />
      </div>
  }

  return <div className="app">
    <h1>Votify</h1>
    {render()}
  </div>
}

export default App
