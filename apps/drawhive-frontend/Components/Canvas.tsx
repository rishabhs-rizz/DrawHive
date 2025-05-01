import { initDraw } from "@/draw";
import { use, useEffect, useRef, useState } from "react";
import TopBar from "./TopBar";
import { Bounce, toast, ToastContainer } from "react-toastify";

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
    toast("🦄 Joined the room ", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      theme: "dark",
      transition: Bounce,
    });
  }, []);

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
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Bounce}
      />
      <canvas
        ref={canvasref}
        width={window.innerWidth}
        height={window.innerHeight}
      ></canvas>
      <TopBar selectedTool={selectedTool} SetselectedTool={SetselectedTool} />
    </div>
  );
}
