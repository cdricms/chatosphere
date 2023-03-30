import { lazy, createEffect, onMount } from "solid-js";
import { Routes, Route, useNavigate } from "@solidjs/router";
import {
  authenticate,
  handle,
  setHandle,
  setNickname,
  setSocket,
} from "./store";
import io from "socket.io-client";

const Register = lazy(() => import("./Register"));
const App = lazy(() => import("./App"));

const R = () => {
  const navigate = useNavigate();

  onMount(() => {
    const handle = localStorage.getItem("handle");
    const nickname = localStorage.getItem("nickname");
    if (handle && nickname) {
      setHandle(handle);
      setNickname(nickname);
    }
  });

  createEffect(() => {
    console.log(handle());
    if (handle().length < 1) {
      navigate("/register");
    } else {
      setSocket(
        io("", {
          transports: ["websocket"],
          reconnection: true,
        })
      );
    }
  });

  return (
    <Routes>
      <Route path="/register" component={Register} />
      <Route path="/" component={App} />
    </Routes>
  );
};

export default R;
