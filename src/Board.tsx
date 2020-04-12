import React from 'react'
import styled from 'styled-components'
import { useSelector } from './utils/hooks'

export default function Board() {
  const board = useSelector(({ game }) => game.board)

  return (
    <S.Board width={board.width} height={board.height}>
      {board.cells.map(({ type }, i) => (
        <S.Stone key={i} data-type={type} />
      ))}
    </S.Board>
  )
}

const S = {
  Board: styled.div<{ width: number; height: number }>`
    display: grid;
    grid-template-columns: repeat(${({ width }) => width}, 1fr);
    grid-template-rows: repeat(${15}, 1fr);
    background-color: #000;
    grid-gap: 1px;
    width: 90vmin;
    height: 90vmin;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translateX(-50%) translateY(-50%);
    font-family: 'Poppins', sans-serif;
  `,

  Stone: styled.div`
    background-color: #3c825a;
    position: relative;

    &:after {
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
      &:after {
        content: 'triple word';
      }
    }
    &[data-type='double-word'] {
      background-color: #d2a078;
      &:after {
        content: 'double word';
      }
    }
    &[data-type='triple-letter'] {
      background-color: #3282b4;
      &:after {
        content: 'triple letter';
      }
    }
    &[data-type='double-letter'] {
      background-color: #78afcd;
      &:after {
        content: 'double letter';
      }
    }
  `,
}
