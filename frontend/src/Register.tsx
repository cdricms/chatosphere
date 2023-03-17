import { Component, createSignal } from 'solid-js'
import { authenticate, setNickname } from './store'
import { useNavigate } from '@solidjs/router'

const Register: Component = () => {
  const [nick, setNick] = createSignal('')
  const navigate = useNavigate()

  return (
    <div>
      <input
        type='text'
        placeholder='Nickname'
        value={nick()}
        onInput={(e) => setNick(e.currentTarget.value)}
      />
      <button
        type='button'
        onClick={() => {
          setNickname(nick())
          authenticate()
          navigate('/')
        }}
      >
        Submit
      </button>
    </div>
  )
}

export default Register
