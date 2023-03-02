import { Component, For } from 'solid-js'
import { currentConv, sendMessage, setCurrentMessage } from '../store'

import styles from './Content.module.css'
import Message from './Message'

const Content: Component<{ class: string }> = ({ class: className }) => {
  let msgInputRef: HTMLTextAreaElement | undefined

  return (
    <section class={className}>
      <div class={styles.messages}>
        <For each={currentConv().messages}>
          {(message) => <Message message={message} />}
        </For>
      </div>
      <div class={styles.input_box}>
        <textarea
          class={styles.current_message}
          value={currentConv().currentMessage}
          ref={msgInputRef}
          oninput={(e) => {
            setCurrentMessage(e.currentTarget.value)
            e.currentTarget.style.height = 'auto'
            e.currentTarget.style.height = e.currentTarget.scrollHeight + 'px'
          }}
        />
        <button
          type='button'
          onclick={() => {
            sendMessage()
            msgInputRef!.style.height = 'auto'
          }}
        >
          Send
        </button>
      </div>
    </section>
  )
}

export default Content
