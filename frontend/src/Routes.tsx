import { lazy, createEffect, onMount } from 'solid-js'
import { Routes, Route, useNavigate } from '@solidjs/router'
import { authenticate, nickname, setNickname, setSocket } from './store'
import io from 'socket.io-client'

const Register = lazy(() => import('./Register'))
const App = lazy(() => import('./App'))

const R = () => {
  const navigate = useNavigate()

  onMount(() => {
    const _nickname = localStorage.getItem('nickname')
    if (_nickname) {
      setNickname(_nickname)
      authenticate()
    }
  })

  createEffect(() => {
    console.log(nickname())
    if (nickname().length < 1) {
      navigate('/register')
    } else {
      setSocket(
        io(':8080', {
          transports: ['websocket'],
          reconnection: true,
        })
      )
    }
  })

  return (
    <Routes>
      <Route path='/register' component={Register} />
      <Route path='/' component={App} />
    </Routes>
  )
}

export default R
