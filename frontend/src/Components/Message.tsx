import { Component } from 'solid-js'
import { IMessage } from '../types/conversation'

import styles from './Message.module.css'

const Message: Component<{ message: IMessage }> = ({ message }) => {
  return (
    <div>
      <div class={styles.message}>
        <span class={styles.nickname}>{message.sender.nickname}</span>
        <div class={styles.content}>{message.content}</div>
      </div>
      <span class={styles.sent_date}>
        {new Intl.DateTimeFormat('en-FR', {
          day: 'numeric',
          month: 'numeric',
          year: '2-digit',
          hour: 'numeric',
          minute: 'numeric',
        }).format(message.sent)}
      </span>
    </div>
  )
}

export default Message
