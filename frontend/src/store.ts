import { createEffect, createSignal, createUniqueId } from "solid-js";
import { IConv, IMessage, ISender } from "types/conversation";
import type io from "socket.io-client";

export const [nickname, _setNickname] = createSignal("");
export const [handle, _setHandle] = createSignal("");
export const [to, setTo] = createSignal("");
export const [contactRequestsReceived, _setContactRequestsReceived] =
  createSignal<ISender[]>([]);
export const [contactRequestsSent, _setContactRequestsSent] = createSignal<
  ISender[]
>([]);
export const [contacts, _setContacts] = createSignal<ISender[]>([]);

export const [socket, setSocket] = createSignal<ReturnType<typeof io>>();

const createEmptyConversation = (handle: string) => {
  if (!conversations()[handle]) {
    setConversations((prev) => ({
      ...prev,
      [handle]: { to: handle, messages: [], currentMessage: "" },
    }));
  }
};

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

export const setNickname = (_nickname: string) => {
  _setNickname(_nickname);
  localStorage.setItem("nickname", nickname());
};

export const currentConv = () => to();

export const [conversations, setConversations] = createSignal<{
  [handle: string]: IConv;
}>({});

export const addContact = (contact: string) => {
  socket()?.emit("sendContactRequest", handle(), contact);
  socket()?.once("sendContactRequestRes", () => {
    listContactsRequestsSent();
  });
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

export const listContacts = () => {
  socket()?.emit("listContacts", handle());
  socket()?.once("listContactsRes", (res: ISender[]) => {
    _setContacts(res);
  });
};

export const cancelContactRequest = (reqHandle: string) => {
  socket()?.emit("cancelContactRequest", handle(), reqHandle);
  socket()?.once("cancelContactRequestRes", () => {
    listContactsRequestsSent();
  });
};

export const acceptContactRequest = (reqHandle: string) => {
  socket()?.emit("acceptContactRequest", handle(), reqHandle);
  socket()?.once("acceptContactRequestRes", () => {
    listContactRequestsReceived();
    listContacts();
  });
};

export const refuseContactRequest = (reqHandle: string) => {
  socket()?.emit("refuseContactRequest", handle(), reqHandle);
  socket()?.once("refuseContactRequestRes", () => {
    listContactRequestsReceived();
  });
};

export const deleteContact = (contact: string) => {
  socket()?.emit("deleteContact", handle(), contact);
  socket()?.once("deleteContactRes", () => {
    listContacts();
  });
};

export const setCurrentMessage = (input: string) => {
  setConversations((prev) => ({
    ...prev,
    [currentConv()]: {
      currentMessage: input,
      to: currentConv(),
      messages: prev[currentConv()].messages,
    },
  }));
};

const setNewMessage = (to: string, msg: IMessage) => {
  if (msg.content.length > 0) {
    createEmptyConversation(to);
    setConversations((prev) => ({
      ...prev,
      [to]: {
        ...prev[to],
        messages: [msg, ...prev[to].messages],
      },
    }));
  }
};

export const sendMessage = () => {
  setNewMessage(to(), {
    sender: { handle: handle(), nickname: nickname(), profilPicture: "" },
    content: conversations()[currentConv()].currentMessage,
    sent: Date.now(),
    read: false,
    delivered: false,
    replies: [],
    reactions: [],
    to: to(),
    messageID: createUniqueId(),
  });
  setCurrentMessage("");
  socket()?.emit("sendMessage", conversations()[currentConv()].messages[0]);
  console.log(currentConv());
};

createEffect(() => {
  socket()?.on("healthCheck", (c) => console.log(c));

  socket()?.on("receiveMessage", (msg: IMessage) => {
    setNewMessage(msg.sender.handle, msg);
  });

  socket()?.on("contactRequestReceived", () => {
    listContactRequestsReceived();
  });

  socket()?.on("contactRequestCanceled", () => {
    listContactRequestsReceived();
  });

  socket()?.on("contactRequestAccepted", () => {
    listContactsRequestsSent();
    listContacts();
  });

  socket()?.on("contactRequestRefused", () => {
    listContactsRequestsSent();
  });

  socket()?.on("contactDeleted", () => {
    listContacts();
  });
});

createEffect(() => {
  handle();
  authenticate();
});

createEffect(() => {
  createEmptyConversation(currentConv());
});
