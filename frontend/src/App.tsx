import { Component, createEffect, createSignal, For, onMount } from "solid-js";

import {
  to,
  setTo,
  nickname,
  addContact,
  contactRequestsSent,
  contactRequestsReceived,
  listContactsRequestsSent,
  listContactRequestsReceived,
  listContacts,
  contacts,
  cancelContactRequest,
  acceptContactRequest,
  refuseContactRequest,
  deleteContact,
  handle,
} from "./store";

import styles from "./App.module.scss";
import Content from "./Components/Content";
import { Dynamic } from "solid-js/web";
import Contact from "./Components/Contact";

const Contacts = () => {
  onMount(() => {
    listContacts();
  });
  return (
    <For each={contacts()}>
      {(c) => (
        <Contact
          onClick={() => {
            setTo(c.handle);
          }}
          contact={c}
        >
          <button
            type="button"
            onClick={() => {
              deleteContact(c.handle);
            }}
          >
            X
          </button>
        </Contact>
      )}
    </For>
  );
};
const RequestsSent = () => {
  const [contact, setContact] = createSignal("");
  onMount(() => {
    listContactsRequestsSent();
  });
  return (
    <>
      <div class={styles.add_contact}>
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
      <For each={contactRequestsSent()}>
        {(s) => (
          <Contact contact={s}>
            <>
              <button
                onClick={() => {
                  cancelContactRequest(s.handle);
                }}
              >
                X
              </button>
            </>
          </Contact>
        )}
      </For>
    </>
  );
};
const RequestsReceived = () => {
  onMount(() => {
    listContactRequestsReceived();
  });
  createEffect(() => {
    contactRequestsReceived();
  });
  return (
    <For each={contactRequestsReceived()}>
      {(r) => (
        <Contact contact={r}>
          <button
            type="button"
            onClick={() => {
              refuseContactRequest(r.handle);
            }}
          >
            X
          </button>
          <button
            type="button"
            onClick={() => {
              acceptContactRequest(r.handle);
            }}
          >
            V
          </button>
        </Contact>
      )}
    </For>
  );
};

const options = {
  contacts: Contacts,
  sent: RequestsSent,
  received: RequestsReceived,
};

const App: Component = () => {
  const [tab, setTab] = createSignal<"contacts" | "sent" | "received">(
    "contacts"
  );
  return (
    <main class={styles.main}>
      <section class={styles["contact-info"]}>
        {contacts().find((c) => c.handle === to())?.nickname}
      </section>
      <section class={styles.contacts}>
        <div class={styles.my_info}>
          <div id="my-info">
            <Contact
              style={{ "background-color": "inherit" }}
              contact={{
                handle: handle(),
                nickname: nickname(),
                profilPicture: "",
              }}
            />
          </div>
          <div class={styles.tabs}>
            <For each={Object.keys(options)}>
              {(c) => (
                <button
                  onClick={(e) => setTab(e.currentTarget.value as any)}
                  class={`tab ${tab() === c ? "active-tab" : ""}`}
                  value={c}
                >
                  {c}
                </button>
              )}
            </For>
          </div>
        </div>
        <Dynamic component={options[tab()]} />
      </section>
      <Content class={styles.content} />
    </main>
  );
};

export default App;
