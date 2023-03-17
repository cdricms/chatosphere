import { Component, createSignal } from 'solid-js'
import { authenticate, setNickname, setHandle, register} from './store'
import { useNavigate } from '@solidjs/router'

import styles from "./Register.module.css"

const Register: Component = () => {
  const [nick, setNick] = createSignal('')
  const [hd, setHd] = createSignal("")
  const navigate = useNavigate()

  return (
    <div>
      <input
        type='text'
        placeholder='Nickname'
        value={nick()}
        onInput={(e) => setNick(e.currentTarget.value)}
      />
      <input
        class={styles.handle}
        type='text'
        placeholder='User handle'
        value={hd()}
        onkeydown={e => {
          if (e.key === "@") e.preventDefault()
        }}
        onInput={e => 
          setHd(e.currentTarget.value)
        }
      />
      <button
        type='button'
        onClick={() => {
          setNickname(nick())
          setHandle("@" + hd())
          register()
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
