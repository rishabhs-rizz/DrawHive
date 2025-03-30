"use client";

import { useEffect, useState } from "react";
import { Canvas } from "./Canvas";

export function RoomCanvas({ roomId }: { roomId: string }) {
  const [socket, setsocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket(
      "ws://localhost:8080?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjRmYWVkNjU4LTAyNDYtNDYyNi05MGVjLTFhMjk3ZTg3Njc1NCIsImlhdCI6MTc0MzMxODQ4NH0.lncEj4uDPK4p0Zhju6q8T-KDMp_U_GRgmfQAecdAJ0w"
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
