import { WebSocket, WebSocketServer } from "ws";
import { Uzers } from ".";

export const ChatInRoom = (
  ws: WebSocket,
  wss: WebSocketServer,
  message: string,
  roomId: string,
  id: string
) => {
  const user = Uzers.find((u) => u.ws === ws);
  // Check if the user exists and is part of the room
  if (!user || !user.rooms.includes(roomId)) {
    ws.send(
      JSON.stringify({
        type: "error",
        message: "You are not a member of this room",
      })
    );
    return;
  }

  Uzers.forEach((u) => {
    if (u.rooms.includes(roomId)) {
      u.ws.send(JSON.stringify({ type: "message", message, roomId }));
    }
  });
};
