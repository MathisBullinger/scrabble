import React from 'react'
import styled from 'styled-components'
import { useSelector } from './utils/hooks'

export default function Activity() {
  const active = useSelector(({ game }) =>
    game.players.find(({ id }) => id === game.stage.activePlayer)
  )
  const { meId, valid } = useSelector(({ game }) => game)

  return (
    <S.Activity>
      {active && (
        <p>
          It's{' '}
          {meId === active.id
            ? 'your'
            : active.name
                ?.replace(/s$/, "s'")
                .replace(/([^s'])$/g, "$1's")}{' '}
          turn.
        </p>
      )}
      {valid && <button>next round</button>}
    </S.Activity>
  )
}

const S = {
  Activity: styled.div`
    display: block;
    width: 20rem;
    height: 100vh;
    background-color: #202124;
    color: #fffc;
    padding: 1rem;

    @media (prefers-color-scheme: dark) {
      background-color: #1b1b1c;
    }
  `,
}
