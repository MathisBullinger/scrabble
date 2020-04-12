import React from 'react'
import styled from 'styled-components'
import { useSelector } from './utils/hooks'
import Tile from './Tile'

export default function Tray() {
  const tiles = useSelector(({ game }) => game.tiles)

  return (
    <S.Tray>
      {tiles.map((tile) => (
        <Tile key={tile.key} tile={tile} />
      ))}
    </S.Tray>
  )
}

const S = {
  Tray: styled.div`
    display: flex;
    height: var(--tile-size);
  `,
}
