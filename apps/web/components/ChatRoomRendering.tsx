"use client";

import { useEffect, useState } from "react";
import { useSocket } from "../hooks/useSocket";

export function ChatRoomClient({
  messages,
  id,
}: {
  messages: { message: string }[];
  id: string;
}) {
  const [chats, setChats] = useState(messages);
  const [newTypedMsg, setNewtypedMsg] = useState("");
  const { socket, loading } = useSocket();
  useEffect(() => {
    if (socket && !loading) {
      socket.send(
        JSON.stringify({
          type: "join",
          roomId: id,
        })
      );

      socket.onmessage = (event) => {
        const parsedData = JSON.parse(event.data);
        if (parsedData.type === "chat") {
          if (parsedData.roomId === id) {
            setChats((c) => [...c, { message: parsedData.message }]);
          }
        }
      };
    }
  }, [socket, loading]);

  return (
    <div>
      <div>
        {chats.map((m) => (
          <div>{m.message}</div>
        ))}
      </div>
      <div></div>
      <input
        value={newTypedMsg}
        onChange={(e) => {
          setNewtypedMsg(e.target.value);
        }}
        type="text"
      />
      <button
        onClick={() => {
          socket?.send(
            JSON.stringify({
              type: "chat",
              message: newTypedMsg,
              roomId: id,
            })
          );

          setNewtypedMsg("");
        }}
      >
        Send
      </button>
    </div>
  );
}
