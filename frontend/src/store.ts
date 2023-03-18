import { createEffect, createSignal, createUniqueId } from "solid-js";
import { IConv, IMessage, ISender } from "types/conversation";
import type io from "socket.io-client";

export const [nickname, setNickname] = createSignal("");
export const [handle, _setHandle] = createSignal("");
export const [to, setTo] = createSignal("");
export const [contactRequestsReceived, _setContactRequestsReceived] =
  createSignal<ISender[]>([]);
export const [contactRequestsSent, _setContactRequestsSent] = createSignal<
  ISender[]
>([]);

export const [socket, setSocket] = createSignal<ReturnType<typeof io>>();

export const authenticate = () => {
  socket()?.emit("authenticate", { handle: handle(), nickname: nickname() });
};

export const register = () => {
  socket()?.emit("register", {
    handle: handle(),
    nickname: nickname(),
    profilPicture: "",
  } as ISender);
};

export const setHandle = (_handle: string) => {
  _setHandle(_handle);
  localStorage.setItem("handle", handle());
};

export const [currentConv, setCurrentConv] = createSignal<IConv>({
  currentMessage: "",
  messages: [],
});

export const addContact = (contact: string) => {
  socket()?.emit("sendContactRequest", handle(), contact);
};

export const listContactRequestsReceived = () => {
  socket()?.emit("listRequestsReceived", handle());
  socket()?.once("listRequestsReceivedRes", (res: ISender[]) => {
    console.log(res);
    _setContactRequestsReceived(res);
  });
};

export const listContactsRequestsSent = () => {
  socket()?.emit("listRequestsSent", handle());
  socket()?.once("listRequestsSentRes", (res: ISender[]) => {
    console.log(res);
    _setContactRequestsSent(res);
  });
};

export const setCurrentMessage = (input: string) => {
  setCurrentConv((prev) => ({ ...prev, currentMessage: input }));
};

const setNewMessage = (msg: IMessage) => {
  if (msg.content.length > 0) {
    setCurrentConv((prev) => ({
      ...prev,
      messages: [msg, ...prev.messages],
    }));
  }
};

export const sendMessage = () => {
  setNewMessage({
    sender: { handle: handle(), nickname: nickname(), profilPicture: "" },
    content: currentConv().currentMessage,
    sent: Date.now(),
    read: false,
    delivered: false,
    replies: [],
    reactions: [],
    to: to(),
    messageID: createUniqueId(),
  });
  setCurrentMessage("");
  socket()?.emit("sendMessage", currentConv().messages[0]);
  console.log(currentConv());
};

createEffect(() => {
  socket()?.on("healthCheck", (c) => console.log(c));

  socket()?.on("receiveMessage", (msg: IMessage) => {
    console.log(msg);
    setNewMessage(msg);
  });

  socket()?.on("contactRequestReceived", () => {
    listContactRequestsReceived();
  });
});
