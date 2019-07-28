import React from 'react'
import { createGlobalStyle } from 'styled-components'
import { Normalize } from 'styled-normalize'

export const GlobalCss = createGlobalStyle`
  html {
    box-sizing: border-box;
  }

  *, *:before, *:after {
    box-sizing: inherit;
  }
`

export const GlobalStyle: React.FC = () => <React.Fragment>
  <Normalize />
  <GlobalCss />
</React.Fragment>

export default GlobalStyle
