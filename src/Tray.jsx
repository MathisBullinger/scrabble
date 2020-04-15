import React from 'react'
import styled from 'styled-components'
import { useSelector } from './utils/hooks'
import Tile from './Tile'

export default function Tray() {
  const meId = useSelector(({ game }) => game.meId)
  const tilePool = useSelector(({ game }) => game.tiles)
  const player = useSelector(({ game }) =>
    meId === undefined ? undefined : game.players[meId]
  )
  const tiles = player?.tray.map((tile) =>
    tilePool.find(({ key }) => key === tile)
  )

  if (meId === undefined) return null
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
