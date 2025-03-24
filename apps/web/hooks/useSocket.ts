import { useEffect, useState } from "react";

export function useSocket() {
  const [loading, setloading] = useState(true);
  const [socket, setsocket] = useState<WebSocket>();

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");
    ws.onopen = () => {
      setloading(false);
      setsocket(socket);
    };
  }, []);

  return {
    socket,
    loading,
  };
}
