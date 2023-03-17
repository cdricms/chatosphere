import { createEffect, createSignal, createUniqueId } from 'solid-js'
import { IConv, IMessage, ISender } from 'types/conversation'
import type io from 'socket.io-client'

export const [nickname, setNickname] = createSignal('')
export const [handle, _setHandle] = createSignal("")
export const [to, setTo] = createSignal('')

export const [socket, setSocket] = createSignal<ReturnType<typeof io>>()

export const authenticate = () => {
  socket()?.emit('authenticate', {handle: handle(), nickname: nickname()})
}

export const register = () => {
  socket()?.emit("register", {handle: handle(), nickname: nickname(), profilPicture: ""} as ISender)
}

export const setHandle = (_handle: string) => {
  _setHandle(_handle)
  localStorage.setItem('handle', handle())
}

export const [currentConv, setCurrentConv] = createSignal<IConv>({
  currentMessage: '',
  messages: [],
})


export const addContact = (contact: string) => {
  socket()?.emit("befriend", handle(), contact)
}

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
    sender: { handle: handle(), nickname: nickname(), profilPicture: '' },
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
