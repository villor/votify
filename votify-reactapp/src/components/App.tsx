import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'

import { AppState } from '../store'
import { AUTH_START } from '../store/auth/types';

import GlobalStyle from './styles/GlobalStyle'
import Room from './room/Room'
import Loader from './common/Loader'
import VerticalCenter from './common/VerticalCenter'

const AppContainer = styled.div`
  font-family: sans-serif;
  background: rgb(18,18,18);
  color: white;
  padding: 15px;
  overflow: auto;
  height: 100vh;
  width: 100vw;
`

const App: React.FC = () => {
  const dispatch = useDispatch()
  const loading = useSelector((state: AppState) => state.auth.loading)

  useEffect(() =>  {
    dispatch({ type: AUTH_START })
  }, [dispatch])

  const render = () => {
    if (loading) {
      return <VerticalCenter>
        <Loader />
      </VerticalCenter>
    }

    return <Room code="fjert" />
  }

  return <AppContainer>
    <GlobalStyle />
    {render()}
  </AppContainer>
}

export default App
