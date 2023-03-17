export type TReactionEmojis =
  | '👌'
  | '👍'
  | '👎'
  | '👏'
  | '😂'
  | '😁'
  | '😅'
  | '😍'
  | '😘'
  | '🤞'
  | '💔'

export interface ISender {
  handle: string
  nickname: string
  profilPicture: string
}

export interface IMessage {
  messageID: string
  sender: ISender
  content: string
  sent: number
  read: boolean
  delivered: boolean
  replies: string[]
  to: string
  reactions: TReactionEmojis[]
}

export interface IConv {
  currentMessage: string
  messages: IMessage[]
}
