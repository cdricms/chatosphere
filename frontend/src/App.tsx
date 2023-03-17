import { Component } from 'solid-js'

import { to, setTo } from './store'

import styles from './App.module.css'
import Content from './Components/Content'

const App: Component = () => {
  return (
    <main class={styles.main}>
      <section class={styles['contact-info']}>
        <input
          type='text'
          value={to()}
          onInput={(e) => setTo(e.currentTarget.value)}
        />
      </section>
      <section class={styles.contacts}></section>
      <Content class={styles.content} />
    </main>
  )
}

export default App
