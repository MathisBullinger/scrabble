import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { open, connect } from './rtc'

export default function Connect() {
  const [input, setInput] = useState('')
  const [code, setCode] = useState()

  async function createGame() {
    setCode(await open())
  }

  useEffect(() => {
    if (localStorage.getItem('id')) createGame()
    if (localStorage.getItem('peer'))
      setTimeout(() => connect(localStorage.getItem('peer')), 1000)
  }, [])

  return (
    <S.Connect>
      <button onClick={createGame}>create game</button>
      {!!code && <p>Code: {code}</p>}
      <input value={input} onChange={({ target }) => setInput(target.value)} />
      <button onClick={() => connect(input)}>connect</button>
    </S.Connect>
  )
}

const S = {
  Connect: styled.div`
    button:first-of-type {
      display: block;
    }

    input {
      margin-top: 2rem;
    }
  `,
}
