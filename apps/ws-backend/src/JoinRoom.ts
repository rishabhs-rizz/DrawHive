import { WebSocket, WebSocketServer } from "ws";
import jwt, { JwtPayload } from "jsonwebtoken";
import JWT_SECRET from "@repo/common/config";
import prisma from "@repo/db/prisma";
import { json } from "stream/consumers";

const wss = new WebSocketServer({ port: 8080 });

interface User {
  ws: WebSocket;
  rooms: string[];
  id: string;
}

const Uzers: User[] = [];

function CheckUser(token: string): string | null {
  const decoded = jwt.verify(token, JWT_SECRET as string);

  if (typeof decoded == "string") {
    return null;
  }

  if (!decoded || !(decoded as JwtPayload).id) {
    return null;
  }

  return decoded.id;
}

wss.on("connection", function connection(ws, request) {
  const url = request.url;
  if (!url) {
    return;
  }

  const queryParams = new URLSearchParams(url.split("?")[1]);
  const token = queryParams.get("token") || "";
  const id = CheckUser(token);

  if (!id) {
    ws.send("Unauthorized");
    ws.close();
    return;
  }

  Uzers.push({
    id,
    rooms: [],
    ws,
  });

  ws.on("message", function message(data) {
    const parsedData = JSON.parse(data.toString());

    if (parsedData.type === "join") {
      const room = parsedData.room;
      const user = Uzers.find((u) => u.id === id);

      if (!user) {
        return;
      }

      const validRoom = prisma.room.findUnique({
        where: {
          slug: room,
        },
      });

      if (!validRoom) {
        ws.send(JSON.stringify({ type: "error", message: "Room not found" }));
        return;
      }

      user.rooms.push(room);
    }
  });
});
