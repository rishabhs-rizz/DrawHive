"use client";

import { useEffect, useState } from "react";
import { Canvas } from "./Canvas";

export function RoomCanvas({ roomId }: { roomId: string }) {
  const [socket, setsocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket(
      "ws://localhost:8080?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImFmNGM0N2Y4LWYyYWEtNGQzMS04N2I4LTJlNDdhNmViMjA0OCIsImlhdCI6MTc0NDE5MzUyNn0.clVhIFQbC0RkIlocOCAVOUEf82Mztoarnp9jxGOdkM0"
    );

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
