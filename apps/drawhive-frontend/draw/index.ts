import axios from "axios";

type Shape =
  | {
      type: "rect";
      x: number;
      y: number;
      width: number;
      height: number;
    }
  | {
      type: "circle";
      centerx: number;
      centery: number;
      radius: number;
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

  let clicked = false;
  let startX = 0;
  let startY = 0;
  // @ts-ignore
  let selectedTool = window.selectedTool || "rect";

  canvas?.addEventListener("mousedown", (e) => {
    clicked = true;
    startX = e.clientX;
    startY = e.clientY;
  });

  canvas?.addEventListener("mouseup", (e) => {
    clicked = false;
    const width = e.clientX - startX;
    const height = e.clientY - startY;
    const shape: Shape = {
      type: "rect",
      x: startX,
      y: startY,
      height,
      width,
    };
    existingShapes.push(shape);

    socket.send(
      JSON.stringify({
        type: "chat",
        message: JSON.stringify(shape),
        roomId,
      })
    );
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

  canvas?.addEventListener("mousemove", (e) => {
    if (clicked) {
      const width = e.clientX - startX;
      const height = e.clientY - startY;

      clearCanvas(existingShapes, canvas, ctx);
      ctx.strokeStyle = "rgba(255, 255, 255)";
      ctx.strokeRect(startX, startY, width, height);
    }
  });
}

function clearCanvas(
  existingShapes: Shape[],
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D
) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "rgba(0, 0, 0)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  existingShapes.map((shape) => {
    if (shape.type === "rect") {
      ctx.strokeStyle = "rgba(255, 255, 255)";
      ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
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
