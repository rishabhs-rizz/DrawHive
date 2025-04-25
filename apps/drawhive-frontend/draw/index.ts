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
      startX: number;
      startY: number;
    }
  | {
      type: "pencil";
      startX: number;
      startY: number;
      endX: number;
      endY: number;
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

  canvas?.addEventListener("mousedown", (e) => {
    clicked = true;
    startX = e.clientX;
    startY = e.clientY;
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
        ctx.font = "24px sans-serif";
        ctx.fillStyle = "black";

        let inputText = "";

        // Initial render
        draw();

        // Listen to keypresses
        document.addEventListener("keydown", function (e) {
          // Handle backspace
          if (e.key === "Backspace") {
            e.preventDefault();
            inputText = inputText.slice(0, -1);
          } else if (e.key.length === 1) {
            inputText += e.key;
          }
          draw();
        });

        function draw() {
          // Clear canvas
          ctx?.clearRect(0, 0, canvas.width, canvas.height);

          // Draw text
          ctx?.fillText(inputText, startX, startY);
        }
      } else if (selectedTool === "pencil") {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "rgba(0,0,0)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        clearCanvas(existingShapes, canvas, ctx);

        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.strokeStyle = "#ccc";
        ctx.lineJoin = "round";
        ctx.lineCap = "round";
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.closePath();
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
      shape = {
        type: "text",
        inputText: "",
        startX: startX,
        startY: startY,
      };
    } else if (selectedTool === "pencil") {
      shape = {
        type: "pencil",
        startX: startX,
        startY: startY,
        endX: endX,
        endY: endY,
      };
    }
    console.log("Shape to send:", shape);

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
      ctx.fillStyle = "rgba(255, 255, 255)";
      ctx.font = "20px Arial";
      ctx.fillText(shape.inputText, shape.startX, shape.startY);
    } else if (shape.type === "pencil") {
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
