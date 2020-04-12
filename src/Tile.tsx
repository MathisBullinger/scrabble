import React from 'react'
import styled from 'styled-components'
import { useSelector, useDispatch } from './utils/hooks'
import action from './redux/actions'

interface Props {
  tile: Tile
  placed?: boolean
}

export default function Tile({ tile, placed = false }: Props) {
  const stage = useSelector(({ game }) => game.stage.name)
  const selected = useSelector(({ game }) => game.selected === tile.key)
  const dispatch = useDispatch()

  function select() {
    if (stage !== 'SELECT_TILE') return
    dispatch(action('SELECT_TILE', tile.key))
  }

  return (
    <S.Tile onClick={select} data-selected={selected} data-placed={placed}>
      {tile.letter}
    </S.Tile>
  )
}

const S = {
  Tile: styled.div`
    display: block;
    width: var(--tile-size);
    height: var(--tile-size);
    border-radius: calc(var(--tile-size) * 0.1);
    background-color: #d2c8a0;
    font-family: 'Poppins', sans-serif;
    font-size: 2rem;
    color: #000c;
    text-align: center;
    line-height: var(--tile-size);
    text-transform: uppercase;
    cursor: pointer;
    transition: transform 0.1s ease;
    user-select: none;
    box-shadow: 0px 0px 2px 0px #000b, 0px 3px 3px 1px #0005;

    &:not(:first-child) {
      margin-left: 0.5rem;
    }

    &[data-placed='false']:hover,
    &[data-selected='true'] {
      transform: translateY(-7.5%) scale(1.02);
    }

    &[data-placed='true'] {
      z-index: 1000;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translateX(-50%) translateY(-50%);
    }
  `,
}
