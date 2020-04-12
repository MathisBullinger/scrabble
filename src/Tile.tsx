import React, { useState, useEffect, useRef } from 'react'
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
  const animationStart = useSelector(({ game }) => game.animateFrom)
  const dispatch = useDispatch()
  const [animation, setAnimation] = useState(false)
  const ref = useRef<HTMLDivElement>()

  useEffect(() => {
    console.log({ animationStart })
    if (!animationStart || !ref.current || !placed) return
    const { x, y } = ref.current.getBoundingClientRect()
    ref.current.style.opacity = '0'
    ref.current.style.transition = 'none'
    ref.current.style.transform = `translateX(${
      animationStart.x - x
    }px) translateY(${animationStart.y - y}px)`
    requestAnimationFrame(() => setAnimation(true))
  }, [placed, animationStart])

  function select() {
    if (!ref.current || placed || stage !== 'SELECT_TILE') return
    const { x, y } = ref.current.getBoundingClientRect()
    dispatch(action('SET_ANIMATION_START', { x, y }))
    dispatch(action('SELECT_TILE', tile.key))
  }

  return (
    <S.Tile
      onClick={select}
      data-selected={selected}
      data-placed={placed}
      animation={animation}
      // @ts-ignore
      ref={ref}
    >
      {tile.letter}
    </S.Tile>
  )
}

const S = {
  Tile: styled.div<{ animation: boolean }>`
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
    box-shadow: 0px 0px 1px 0.5px #000b, 0px 3px 3px 1px #0005;

    &:not(:first-child) {
      margin-left: 0.5rem;
    }

    &[data-placed='false']:hover,
    &[data-selected='true'] {
      transform: translateY(-7.5%) scale(1.02);
    }

    &[data-placed='true'] {
      position: absolute;
      left: 50%;
      top: 50%;
      z-index: 1000;

      ${({ animation }) =>
        !animation
          ? ''
          : `
        transition: transform 0.4s ease !important;
        transform: translateX(-50%) translateY(-50%) !important;
        opacity: initial !important;
      `}
    }
  `,
}
