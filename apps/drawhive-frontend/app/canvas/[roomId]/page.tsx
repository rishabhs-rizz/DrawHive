"use client";

import { initDraw } from "@/draw";
import { useEffect, useRef } from "react";

export default function Canvas() {
  const canvasref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasref.current) {
      initDraw(canvasref.current);
    }
  }, [canvasref]);
  return (
    <div>
      <canvas ref={canvasref} width={2000} height={2000}></canvas>
    </div>
  );
}
