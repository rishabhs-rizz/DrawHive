import { initDraw } from "@/draw";
import { useEffect, useRef } from "react";

export function Canvas({
  roomId,
  socket,
}: {
  roomId: string;
  socket: WebSocket;
}) {
  const canvasref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasref.current) {
      initDraw(canvasref.current, roomId, socket);
    }
  }, [canvasref]);

  return (
    <div>
      <canvas ref={canvasref} width={2000} height={2000}></canvas>
    </div>
  );
}
