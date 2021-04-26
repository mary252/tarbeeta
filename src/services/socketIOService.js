import io from "socket.io-client";
import { socketUrl } from "../common";
import { getJwt } from "../ultils";
import * as actions from "../actions";
import store from "../Store";
export function connectRT() {
  let socket = io.connect(socketUrl, {
    query: `token=${getJwt()}`
  });

  socket.on("connect", () => {
  });

  socket.on("new_notification", nofitication => {
    store.dispatch(actions.NewNotification(nofitication));
  });
}
