import { initDraw } from "@/draw";
import { useEffect, useRef, useState } from "react";
import TopBar from "./TopBar";

export type Tool = "circle" | "rect" | "line" | "eraser" | "pencil" | "text";

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
    // @ts-ignore
    window.selectedTool = selectedTool;
  }, [selectedTool]);

  useEffect(() => {
    if (canvasref.current) {
      console.log("canvas");
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
