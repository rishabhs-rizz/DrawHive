import { initDraw } from "@/draw";
import { useEffect, useRef, useState } from "react";
import TopBar from "./TopBar";

export type Tool = "circle" | "rect" | "pencil" | "eraser";

export function Canvas({
  roomId,
  socket,
}: {
  roomId: string;
  socket: WebSocket;
}) {
  const canvasref = useRef<HTMLCanvasElement>(null);
  const [selectedTool, SetselectedTool] = useState<Tool>("rect");

  useEffect(() => {
    if (canvasref.current) {
      console.log("canvas");
      //@ts-ignore
      window.selectedTool = selectedTool;
      initDraw(canvasref.current, roomId, socket);
    }
  }, [canvasref]);

  return (
    <div className="h-[100vh] overflow-hidden ">
      <canvas
        ref={canvasref}
        width={window.innerWidth}
        height={window.innerHeight}
      ></canvas>
      <TopBar selectedTool={selectedTool} SetselectedTool={SetselectedTool} />
    </div>
  );
}
