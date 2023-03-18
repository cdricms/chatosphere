import { Component, createSignal, For, onMount } from "solid-js";

import {
  to,
  setTo,
  nickname,
  addContact,
  contactRequestsSent,
  contactRequestsReceived,
  listContactsRequestsSent,
  listContactRequestsReceived,
} from "./store";

import styles from "./App.module.css";
import Content from "./Components/Content";
import { Dynamic } from "solid-js/web";

const Contacts = () => <div>Contacts</div>;
const RequestsSent = () => {
  onMount(() => {
    listContactsRequestsSent();
  });
  return <For each={contactRequestsSent()}>{(r) => <p>{r.handle}</p>}</For>;
};
const RequestsReceived = () => {
  onMount(() => {
    listContactRequestsReceived();
  });
  return <For each={contactRequestsReceived()}>{(r) => <p>{r.handle}</p>}</For>;
};

const contacts = {
  contacts: Contacts,
  sent: RequestsSent,
  received: RequestsReceived,
};

const App: Component = () => {
  const [contact, setContact] = createSignal("");
  const [tab, setTab] = createSignal<"contacts" | "sent" | "received">(
    "contacts"
  );
  return (
    <main class={styles.main}>
      <section class={styles["contact-info"]}>
        <input
          type="text"
          value={to()}
          onInput={(e) => setTo(e.currentTarget.value)}
        />
      </section>
      <section class={styles.contacts}>
        <div id="my-info">{nickname()}</div>
        <div>
          <input
            type="text"
            value={contact()}
            onInput={(e) => setContact(e.currentTarget.value)}
          />
          <button
            type="button"
            onClick={() => {
              addContact(contact());
            }}
          >
            Add
          </button>
        </div>
        <select
          value={tab()}
          onInput={(e) => setTab(e.currentTarget.value as unknown as any)}
        >
          <For each={Object.keys(contacts)}>
            {(c) => <option value={c}>{c}</option>}
          </For>
        </select>
        <Dynamic component={contacts[tab()]} />
      </section>
      <Content class={styles.content} />
    </main>
  );
};

export default App;
