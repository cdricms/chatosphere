import { createSignal } from 'solid-js'
import { IConv } from './types/conversation'

export const [currentConv, setCurrentConv] = createSignal<IConv>({
  currentMessage: '',
  messages: [],
})

export const setCurrentMessage = (input: string) => {
  setCurrentConv((prev) => ({ ...prev, currentMessage: input }))
}

export const sendMessage = () => {
  setCurrentConv((prev) => ({
    ...prev,
    messages: [
      {
        sender: { userId: 'me', nickname: 'Cédric', profilPicture: '' },
        content: prev.currentMessage,
        sent: Date.now(),
        read: false,
        delivered: false,
        replies: [],
        reactions: [],
      },
      ...prev.messages,
    ],
  }))
  setCurrentMessage('')
  console.log(currentConv())
}
