import { Component, JSX } from "solid-js";
import { ISender } from "types/conversation";
import { to } from "../store";

import styles from "./Contact.module.scss";

const Contact: Component<
  { contact: ISender } & JSX.HTMLAttributes<HTMLDivElement>
> = ({ contact, children, ...div }) => {
  return (
    <div {...div} class={styles.contact} data-active={contact.handle === to()}>
      <div class={styles.contact_info}>
        <img src={contact.profilPicture} alt="" />
        <h2>{contact.nickname}</h2>
        <p class={styles.handle}>{contact.handle}</p>
      </div>
      <div>{children}</div>
    </div>
  );
};

export default Contact;
