import React from 'react'
import styled from 'styled-components'

const ROWS = 15

const cells = Array(ROWS ** 2)
  .fill(0)
  .map((_, i) => {
    const x = i % 15
    const y = (i / 15) | 0

    const nMax = (ROWS - 1) / 2
    const nx = x <= nMax ? x : nMax - (x - nMax)
    const ny = y <= nMax ? y : nMax - (y - nMax)

    const every = (...v) => [nx, ny].every((n) => v.includes(n))
    const one = (v1, v2) =>
      [nx, ny].some((n) => n === v1) && [nx, ny].some((n) => n === v2)

    if (every(nMax)) return { type: 'origin' }
    else if (every(nMax - 1) || one(2, nMax - 1) || one(3, nMax) || one(3, 0))
      return { type: 'double-letter' }
    else if (every(0, nMax)) return { type: 'triple-word' }
    else if (every(1, nMax - 2) && !every(1)) return { type: 'triple-letter' }
    else if (nx === ny) return { type: 'double-word' }
    return {}
  })

export default function Board() {
  return (
    <S.Board>
      {cells.map(({ type }, i) => (
        <S.Stone key={i} data-type={type} />
      ))}
    </S.Board>
  )
}

const S = {
  Board: styled.div`
    display: grid;
    grid-template-columns: repeat(${ROWS}, 1fr);
    grid-template-rows: repeat(${ROWS}, 1fr);
    background-color: #000;
    grid-gap: 1px;
    width: 90vmin;
    height: 90vmin;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translateX(-50%) translateY(-50%);
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
