"use client";

import { useEffect, useState } from "react";
import { Canvas } from "./Canvas";

export function RoomCanvas({ roomId }: { roomId: string }) {
  const [socket, setsocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket(
      "ws://localhost:8080?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjIwN2JjMjY3LWY5Y2EtNDg3ZC04MDYxLTViZTIyMDM3OTRmOCIsImlhdCI6MTc0NTM5MzQ1NX0.tbVxJxT5BFbj8JQP9huNg4PrnNvqsXa205Iocfsd-ZY"
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
