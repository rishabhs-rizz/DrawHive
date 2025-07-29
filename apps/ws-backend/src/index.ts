import { WebSocketServer } from "ws";
import jwt, { JwtPayload } from "jsonwebtoken";
import JWT_SECRET from "@repo/common/config";
import { JoinRoom } from "./JoinRoom";
import { LeaveRoom } from "./LeaveRoom";
import { ChatInRoom } from "./ChatInRoom";

import dotenv from "dotenv";
dotenv.config();

const wss = new WebSocketServer({ port: 8080 });

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

export interface User {
  ws: import("ws").WebSocket;
  rooms: string[];
  id: string;
}

export let Uzers: User[] = [];

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

  ws.on("message", function incoming(message: string) {
    try {
      const ParsedData = JSON.parse(message);

      if (!ParsedData.type) {
        ws.send("Type Required");
        return;
      }

      switch (ParsedData.type) {
        case "join":
          JoinRoom(ws, wss, ParsedData.roomId, id);
          break;
        case "chat":
          ChatInRoom(ws, wss, ParsedData.message, ParsedData.roomId, id);
          break;
        case "leave":
          LeaveRoom(ws, wss, ParsedData.roomId, id);
          break;
        default:
          ws.send("Invalid event Type");
          break;
      }
    } catch (error) {
      ws.send("Invalid JSON");
    }
  });

  ws.send("connected to server");
});
