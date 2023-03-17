import { Component, createSignal } from 'solid-js'

import { to, setTo, nickname, addContact } from './store'

import styles from './App.module.css'
import Content from './Components/Content'

const App: Component = () => {
  const [contact, setContact] = createSignal("")
  return (
    <main class={styles.main}>
      <section class={styles['contact-info']}>
        <input
          type='text'
          value={to()}
          onInput={(e) => setTo(e.currentTarget.value)}
        />
      </section>
      <section class={styles.contacts}>
        <div id="my-info">
          {nickname()}
        </div>
        <div>
          <input type="text" value={contact()} onInput={(e) => setContact(e.currentTarget.value)} />
          <button type="button" onClick={() => {
            addContact(contact())
          }}>Add</button>
        </div>
      </section>
      <Content class={styles.content} />
    </main>
  )
}

export default App
