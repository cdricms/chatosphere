import { Component } from 'solid-js'

import styles from './App.module.css'
import Content from './Components/Content'

const App: Component = () => {
  return (
    <main class={styles.main}>
      <section class={styles['contact-info']}></section>
      <section class={styles.contacts}></section>
      <Content class={styles.content} />
    </main>
  )
}

export default App
