import { WebSocket, WebSocketServer } from "ws";
import prisma from "@repo/db/prisma";
import { Uzers } from "./index";

export const JoinRoom = async (
  ws: WebSocket,
  wss: WebSocketServer,
  roomId: string,
  id: string
) => {
  const user = Uzers.find((u) => u.ws === ws);

  if (!user) {
    return;
  }

  const validRoom = await prisma.room.findUnique({
    where: {
      id: parseInt(roomId, 10),
    },
  });

  if (!validRoom) {
    ws.send(JSON.stringify({ type: "error", message: "Room not found" }));
    return;
  }

  user.rooms.push(roomId);
};
