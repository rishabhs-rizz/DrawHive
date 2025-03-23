import { WebSocket, WebSocketServer } from "ws";
import { Uzers } from "./index";

export const LeaveRoom = (
  ws: WebSocket,
  wss: WebSocketServer,
  roomId: string,
  id: string
) => {
  const user = Uzers.find((u) => u.ws === ws);
  if (!user) {
    return;
  }
  user.rooms = user.rooms.filter((r) => r !== roomId);
};
