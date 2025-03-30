import { WebSocket, WebSocketServer } from "ws";
import { Uzers } from ".";
import prisma from "@repo/db/prisma";

export const ChatInRoom = async (
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

  // Save the message to the database
  const chat = await prisma.chat.create({
    data: {
      message,
      userId: id,
      roomID: parseInt(roomId, 10),
      timestamp: new Date(),
    },
  });

  Uzers.forEach((u) => {
    if (u.rooms.includes(roomId)) {
      u.ws.send(JSON.stringify({ type: "chat", message, roomId }));
    }
  });
};
