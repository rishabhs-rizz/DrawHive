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
      x: number;
      y: number;
      radiusX: number;
      radiusY: number;
      rotation: number;
      startAngle: number;
      endAngle: number;
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
  // @ts-ignore
  const selectedTool = window.selectedTool || "rect";

  canvas?.addEventListener("mousedown", (e) => {
    clicked = true;
    startX = e.clientX;
    startY = e.clientY;
  });

  canvas?.addEventListener("mouseup", (e) => {
    clicked = false;
    const width = e.clientX - startX;
    const height = e.clientY - startY;
    let shape: Shape | null = null;
    if (selectedTool === "rect") {
      const rect = canvas.getBoundingClientRect();
      startX = e.clientX - rect.left;
      startY = e.clientY - rect.top;
      shape = {
        type: "rect",
        x: startX,
        y: startY,
        width: width,
        height: height,
      };
    } else if (selectedTool === "circle") {
      const radius = Math.sqrt(width * width + height * height) / 2;
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
    } else {
      return; // Invalid tool, do nothing
    }
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
        // } else if (selectedTool === "circle") {
        //   const rect = canvas.getBoundingClientRect();
        //   const currentX = e.clientX - rect.left;
        //   const currentY = e.clientY - rect.top;

        //   const width = currentX - startX;
        //   const height = currentY - startY;
        //   const size = Math.min(Math.abs(width), Math.abs(height)); // make it a circle (equal sides)

        //   // Adjust circle start point depending on drag direction
        //   const offsetX = width < 0 ? -size : 0;
        //   const offsetY = height < 0 ? -size : 0;

        //   // Clear canvas for preview
        //   clearCanvas(existingShapes, canvas, ctx);
        //   ctx.strokeStyle = "rgba(255, 255, 255)";

        //   ctx.beginPath();
        //   ctx.arc(
        //     startX + offsetX + size / 2,
        //     startY + offsetY + size / 2,
        //     size / 2,
        //     0,
        //     2 * Math.PI
        //   );
        //   ctx.stroke();
      }
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
