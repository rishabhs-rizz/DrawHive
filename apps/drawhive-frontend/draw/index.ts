import axios from "axios";
import { handleText } from "./HandleText";

export type Shape =
  | {
      type: "rect";
      x: number;
      y: number;
      width: number;
      height: number;
    }
  | {
      type: "circle";
      x: number;
      y: number;
      radiusX: number;
      radiusY: number;
      rotation: number;
      startAngle: number;
      endAngle: number;
    }
  | {
      type: "line";
      x: number;
      y: number;
      endX: number;
      endY: number;
    }
  | {
      type: "text";
      inputText: string;
      x: number;
      y: number;
    }
  | {
      type: "pencil";
      points: { x: number; y: number }[];
    };

export async function initDraw(
  canvas: HTMLCanvasElement,
  roomId: string,
  socket: WebSocket
) {
  const ctx = canvas?.getContext("2d");

  let existingShapes: Shape[] = [];

  try {
    existingShapes = await getExistingShapes(roomId);
  } catch (e) {
    console.error("Error fetching existing shapes:", e);
  }

  if (!ctx) {
    return;
  }

  clearCanvas(existingShapes, canvas, ctx);

  let endX: number;
  let endY: number;
  let startX: number;
  let startY: number;
  let clicked: boolean = false;
  let width: number;
  let height: number;

  let isDrawing = false;
  let points: { x: number; y: number }[] = [];

  ctx.strokeStyle = "rgba(255, 255, 255)";
  ctx.lineWidth = 2;

  canvas?.addEventListener("mousedown", (e) => {
    clicked = true;
    startX = e.clientX;
    startY = e.clientY;

    // @ts-ignore
    const selectedTool = window.selectedTool;

    if (selectedTool === "pencil") {
      isDrawing = true;
      points = [{ x: e.offsetX, y: e.offsetY }];
    }
  });

  canvas?.addEventListener("mousemove", (e) => {
    if (clicked && socket) {
      endX = e.clientX;
      endY = e.clientY;
      width = endX - startX;
      height = endY - startY;
      // @ts-ignore
      const selectedTool = window.selectedTool;

      if (selectedTool === "rect") {
        const width = e.clientX - startX;
        const height = e.clientY - startY;

        clearCanvas(existingShapes, canvas, ctx);
        ctx.strokeStyle = "rgba(255, 255, 255)";

        ctx.strokeRect(startX, startY, width, height);
      } else if (selectedTool === "circle") {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "rgba(0,0,0)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        clearCanvas(existingShapes, canvas, ctx);

        ctx.beginPath();
        ctx.ellipse(
          startX + width / 2,
          startY + height / 2,
          Math.abs(width) / 2,
          Math.abs(height) / 2,
          0,
          0,
          2 * Math.PI
        );
        ctx.strokeStyle = "rgba(255,255,255)";
        ctx.stroke();
        ctx.closePath();
      } else if (selectedTool === "line") {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "rgba(0,0,0)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        clearCanvas(existingShapes, canvas, ctx);

        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.strokeStyle = "rgba(255,255,255)";
        ctx.stroke();
        ctx.closePath();
      } else if (selectedTool === "text") {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "rgba(0,0,0)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        clearCanvas(existingShapes, canvas, ctx);
      } else if (selectedTool === "pencil") {
        if (isDrawing && selectedTool === "pencil") {
          points.push({ x: e.offsetX, y: e.offsetY });
          ctx.beginPath();
          ctx.moveTo(points[points.length - 2].x, points[points.length - 2].y);
          ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);
          ctx.strokeStyle = "rgba(255, 255, 255)";
          ctx.lineWidth = 2;
          ctx.stroke();
          ctx.closePath();
        }
      } else if (selectedTool === "eraser" && clicked) {
        const mouseX = e.offsetX;
        const mouseY = e.offsetY;

        existingShapes = existingShapes.filter((shape) => {
          let shouldKeep = true;
          if (shape.type === "rect") {
            shouldKeep = !(
              mouseX >= shape.x &&
              mouseX <= shape.x + shape.width &&
              mouseY >= shape.y &&
              mouseY <= shape.y + shape.height
            );
          } else if (shape.type === "circle") {
            const dx = mouseX - shape.x;
            const dy = mouseY - shape.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            shouldKeep = distance > shape.radiusX;
          } else if (shape.type === "text") {
            const textWidth = ctx.measureText(shape.inputText).width;
            const textHeight = 24;
            shouldKeep = !(
              mouseX >= shape.x &&
              mouseX <= shape.x + textWidth &&
              mouseY >= shape.y - textHeight &&
              mouseY <= shape.y
            );
          } else if (shape.type === "pencil") {
            shouldKeep = !shape.points.some((point) => {
              const dx = mouseX - point.x;
              const dy = mouseY - point.y;
              return Math.sqrt(dx * dx + dy * dy) < 5;
            });
          } else if (shape.type === "line") {
            //@ts-ignore
            const distanceToLine = (x, y, x1, y1, x2, y2) => {
              const A = x - x1;
              const B = y - y1;
              const C = x2 - x1;
              const D = y2 - y1;

              const dot = A * C + B * D;
              const lenSq = C * C + D * D;
              const param = lenSq !== 0 ? dot / lenSq : -1;

              let xx, yy;

              if (param < 0) {
                xx = x1;
                yy = y1;
              } else if (param > 1) {
                xx = x2;
                yy = y2;
              } else {
                xx = x1 + param * C;
                yy = y1 + param * D;
              }

              const dx = x - xx;
              const dy = y - yy;
              return Math.sqrt(dx * dx + dy * dy);
            };

            const threshold = 10;
            shouldKeep =
              distanceToLine(
                mouseX,
                mouseY,
                shape.x,
                shape.y,
                shape.endX,
                shape.endY
              ) > threshold;
          }

          if (!shouldKeep) {
            socket.send(
              JSON.stringify({
                type: "delete",
                message: JSON.stringify(shape),
                roomId,
              })
            );
          }

          return shouldKeep;
        });

        clearCanvas(existingShapes, canvas, ctx);
      }
    }
  });

  canvas?.addEventListener("mouseup", (e) => {
    clicked = false;
    let shape: Shape | null = null;
    // @ts-ignore
    const selectedTool = window.selectedTool;

    if (selectedTool === "rect") {
      shape = {
        type: "rect",
        x: startX,
        y: startY,
        width: width,
        height: height,
      };
    } else if (selectedTool === "circle") {
      shape = {
        type: "circle",
        x: startX + width / 2,
        y: startY + height / 2,
        radiusX: Math.abs(width) / 2,
        radiusY: Math.abs(height) / 2,
        rotation: 0,
        startAngle: 0,
        endAngle: 2 * Math.PI,
      };
    } else if (selectedTool === "line") {
      shape = {
        type: "line",
        x: startX,
        y: startY,
        endX: endX,
        endY: endY,
      };
    } else if (selectedTool === "text") {
      const input = document.createElement("input");
      input.type = "text";
      input.style.position = "fixed";
      input.style.left = `${startX}px`;
      input.style.top = `${startY}px`;
      input.style.border = "none";
      input.style.outline = "none";
      input.style.color = "white";
      input.style.width = "400px";
      input.onkeydown = (event) =>
        handleText(event, startX, startY, ctx, existingShapes, roomId, socket);
      document.body.appendChild(input);
      input.focus();
    } else if (selectedTool === "pencil") {
      isDrawing = false;
      if (points.length > 0) {
        shape = {
          type: "pencil",
          points: [...points],
        };
        existingShapes.push(shape);
      }
    }

    if (shape) {
      socket.send(
        JSON.stringify({
          type: "chat",
          message: JSON.stringify(shape),
          roomId,
        })
      );
    }
  });

  canvas?.addEventListener("mouseout", () => {
    // @ts-ignore
    const selectedTool = window.selectedTool;

    if (selectedTool === "pencil") {
      isDrawing = false;
    }
  });

  socket.onmessage = (event) => {
    const parsedData = JSON.parse(event.data);
    console.log(parsedData.type);

    if (parsedData.type === "chat") {
      const parsedShape = JSON.parse(parsedData.message);

      console.log("Parsed Shape:", parsedShape);

      existingShapes.push(parsedShape);
      clearCanvas(existingShapes, canvas, ctx);
    }
  };
}

function clearCanvas(
  existingShapes: Shape[],
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D
) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "rgba(0, 0, 0)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  existingShapes.filter(Boolean).forEach((shape) => {
    if (shape.type === "rect") {
      ctx.strokeStyle = "rgba(255, 255, 255)";
      ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
    } else if (shape.type === "circle") {
      ctx.strokeStyle = "rgba(255, 255, 255)";
      ctx.beginPath();
      ctx.ellipse(
        shape.x,
        shape.y,
        shape.radiusX,
        shape.radiusY,
        shape.rotation,
        shape.startAngle,
        shape.endAngle
      );
      ctx.stroke();
      ctx.closePath();
    } else if (shape.type === "line") {
      ctx.strokeStyle = "rgba(255, 255, 255)";
      ctx.beginPath();
      ctx.moveTo(shape.x, shape.y);
      ctx.lineTo(shape.endX, shape.endY);
      ctx.stroke();
      ctx.closePath();
    } else if (shape.type === "text") {
      ctx.strokeStyle = "white";
      ctx.font = "24px Arial";
      ctx.fillStyle = "white";
      ctx.fillText(shape.inputText, shape.x, shape.y);
    } else if (shape.type === "pencil") {
      if (shape.points && shape.points.length > 1) {
        ctx.strokeStyle = "rgba(255, 255, 255)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        shape.points.forEach((point, index) => {
          if (index === 0) {
            ctx.moveTo(point.x, point.y);
          } else {
            ctx.lineTo(point.x, point.y);
          }
        });
        ctx.stroke();
      }
    }
  });
}

async function getExistingShapes(roomId: string) {
  console.log("Fetching shapes for roomId:", roomId);
  try {
    const res = await axios.get(`http://localhost:5000/chats/${roomId}`);
    const data = res.data.chats || [];
    console.log(res.data.chats);

    const shapes = data.map((x: { message: string }) => {
      const messageData = JSON.parse(x.message);
      return messageData;
    });

    return shapes;
  } catch (e) {
    console.error("Error in getExistingShapes:", e);
    return [];
  }
}
