export interface ISender {
  userId: string
  nickname: string
  profilPicture: string
}

export interface IMessage {
  sender: ISender
  content: string
  sent: number
  read: boolean
  delivered: boolean
  replies: string[]
  reactions: string[]
}

export interface IConv {
  currentMessage: string
  messages: IMessage[]
}
