import { createEffect, createSignal, createUniqueId } from 'solid-js'
import { IConv, IMessage } from 'types/conversation'
import type io from 'socket.io-client'

export const [nickname, _setNickname] = createSignal('')
export const [to, setTo] = createSignal('')

export const [socket, setSocket] = createSignal<ReturnType<typeof io>>()

export const authenticate = () => {
  socket()?.emit('authenticate', nickname())
}

export const setNickname = (_nickname: string) => {
  _setNickname(_nickname)
  localStorage.setItem('nickname', nickname())
}

export const [currentConv, setCurrentConv] = createSignal<IConv>({
  currentMessage: '',
  messages: [],
})

createEffect(() => {
  socket()?.on('healthCheck', (c) => console.log(c))

  socket()?.on('receiveMessage', (msg: IMessage) => {
    console.log(msg)
    setNewMessage(msg)
  })
})

export const setCurrentMessage = (input: string) => {
  setCurrentConv((prev) => ({ ...prev, currentMessage: input }))
}

const setNewMessage = (msg: IMessage) => {
  if (msg.content.length > 0) {
    setCurrentConv((prev) => ({
      ...prev,
      messages: [msg, ...prev.messages],
    }))
  }
}

export const sendMessage = () => {
  setNewMessage({
    sender: { userID: nickname(), nickname: nickname(), profilPicture: '' },
    content: currentConv().currentMessage,
    sent: Date.now(),
    read: false,
    delivered: false,
    replies: [],
    reactions: [],
    to: to(),
    messageID: createUniqueId(),
  })
  setCurrentMessage('')
  socket()?.emit('sendMessage', currentConv().messages[0])
  console.log(currentConv())
}
