import React from 'react'
import styled from 'styled-components'
import { useSelector } from './utils/hooks'
import Cell from './Cell'

export default function Board() {
  const board = useSelector(({ game }) => game.board)

  return (
    <S.Board width={board.width} height={board.height}>
      {board.cells.map((cell) => (
        <Cell key={cell.key} cell={cell} />
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
    font-family: 'Poppins', sans-serif;
  `,
}
