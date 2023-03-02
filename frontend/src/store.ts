import { createSignal, createUniqueId } from 'solid-js'
import { IConv } from './types/conversation'

export const [currentConv, setCurrentConv] = createSignal<IConv>({
  currentMessage: '',
  messages: [],
})

export const setCurrentMessage = (input: string) => {
  setCurrentConv((prev) => ({ ...prev, currentMessage: input }))
}

export const sendMessage = () => {
  if (currentConv().currentMessage.length > 0) {
    setCurrentConv((prev) => ({
      ...prev,
      messages: [
        {
          sender: { userID: 'me', nickname: 'Cédric', profilPicture: '' },
          content: prev.currentMessage,
          sent: Date.now(),
          read: false,
          delivered: false,
          replies: [],
          reactions: [],
          messageID: createUniqueId(),
        },
        ...prev.messages,
      ],
    }))
    setCurrentMessage('')
    console.log(currentConv())
  }
}
