"use client";

import { useEffect, useState } from "react";
import { Canvas } from "./Canvas";

export function RoomCanvas({ roomId }: { roomId: string }) {
  const [socket, setsocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");

    ws.onopen = () => {
      setsocket(ws);
      ws.send(
        JSON.stringify({
          type: "join",
          roomId,
        })
      );
    };
  }, []);

  if (!socket) {
    return <div>Connecting to server ...</div>;
  }
  return (
    <div>
      <Canvas roomId={roomId} socket={socket}></Canvas>
    </div>
  );
}
