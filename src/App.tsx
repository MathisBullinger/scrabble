import React from 'react'
import styled from 'styled-components'
import { useSelector } from './utils/hooks'
import Board from './Board'
import Tray from './Tray'
import Connect from './Connect'
import Activity from './Activity'

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
          <S.Game>
            <Board />
            <Tray />
          </S.Game>
          <Activity />
        </>
      )}
    </S.App>
  )
}

const S = {
  App: styled.div`
    display: flex;
    justify-content: space-between;
  `,

  // GameWrap: styled.div`
  //   display: flex;
  // `,

  Game: styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100vh;
    justify-content: space-around;
    --tile-size: calc(90vmin / 15 * 0.9);
    flex-grow: 1;
  `,
}
