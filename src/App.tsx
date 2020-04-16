import React from 'react'
import styled from 'styled-components'
import Board from './Board'
import Tray from './Tray'
import Connect from './Connect'
import { useSelector } from './utils/hooks'

export default function App() {
  const connected = useSelector(
    ({ rtc }) => !rtc.requireConnection || rtc.connection
  )

  return (
    <S.App>
      {!connected ? (
        <Connect />
      ) : (
        <>
          <Board />
          <Tray />
        </>
      )}
    </S.App>
  )
}

const S = {
  App: styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100vh;
    justify-content: space-around;
    --tile-size: calc(90vmin / 15 * 0.9);
    perspective: 400px;
  `,
}
