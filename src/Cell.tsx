import React from 'react'
import styled from 'styled-components'
import { useSelector, useDispatch } from './utils/hooks'
import action from './redux/actions'
import Tile from './Tile'

interface Props {
  cell: Cell
}

export default function Cell({ cell }: Props) {
  const stage = useSelector(({ game }) => game.stage.name)
  const dispatch = useDispatch()
  const tiles = useSelector(({ game }) => game.tiles)

  function select() {
    if (stage !== 'PLACE_TILE') return
    dispatch(action('PLACE_TILE', cell.key))
  }

  return (
    <S.Cell data-type={cell.type} onClick={select}>
      {!!cell.tile && (
        <Tile
          tile={tiles.find(({ key }) => key === cell.tile) as Tile}
          placed
        />
      )}
    </S.Cell>
  )
}

const S = {
  Cell: styled.div`
    background-color: #3c825a;
    position: relative;

    &::after {
      text-align: center;
      text-transform: uppercase;
      color: #000b;
      font-size: 11px;
      position: absolute;
      display: block;
      width: 100%;
      top: 50%;
      transform: translateY(-50%);
    }

    &[data-type='origin'] {
      background-color: #d2a078;
    }
    &[data-type='triple-word'] {
      background-color: #d0372d;
      &::after {
        content: 'triple word';
      }
    }
    &[data-type='double-word'] {
      background-color: #d2a078;
      &::after {
        content: 'double word';
      }
    }
    &[data-type='triple-letter'] {
      background-color: #3282b4;
      &::after {
        content: 'triple letter';
      }
    }
    &[data-type='double-letter'] {
      background-color: #78afcd;
      &::after {
        content: 'double letter';
      }
    }

    [data-stage='PLACE_TILE'] > &:hover {
      cursor: pointer;

      &::before {
        content: '';
        position: absolute;
        width: 100%;
        height: 100%;
        background-color: #fff8;
      }
    }
  `,
}
