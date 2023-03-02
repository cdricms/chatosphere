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
          onkeypress={(k) => {
            switch (k.key) {
              case 'Enter':
                if (k.shiftKey) {
                  break
                }
                k.preventDefault()
                sendMessage()
                k.currentTarget.style.height = 'auto'
                break
              default:
                break
            }
          }}
          oninput={(e) => {
            setCurrentMessage(e.currentTarget.value)
            e.currentTarget.style.height = 'auto'
            e.currentTarget.style.height = e.currentTarget.scrollHeight + 'px'
          }}
        />
        <button
          class={styles.send_btn}
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
