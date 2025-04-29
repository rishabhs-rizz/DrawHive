import { Shape } from ".";

export const handleText = (
  e: KeyboardEvent,
  startX: number,
  startY: number,
  ctx: CanvasRenderingContext2D,
  exisitedShapes: Shape[],
  roomId: string,
  socket: WebSocket
) => {
  const input = e.target as HTMLInputElement;
  if (e.key === "Enter" && !e.shiftKey) {
    const text = input.value;
    ctx.font = "24px Arial";
    ctx.fillStyle = "white";
    ctx.fillText(text, startX, startY);
    document.body.removeChild(input);

    const shape: Shape = {
      type: "text",
      inputText: text,
      x: startX,
      y: startY,
    };
    exisitedShapes.push(shape);

    socket.send(
      JSON.stringify({
        type: "chat",
        message: JSON.stringify(shape),
        roomId,
      })
    );
  } else if (e.shiftKey && e.key === "Enter") {
    input.value += "\n";
  }
};
