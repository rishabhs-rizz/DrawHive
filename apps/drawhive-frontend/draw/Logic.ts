import { Tool } from "@/Components/Canvas";
import { getExistingShapes } from "./http";

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
    }
  | {
      type: "pencil";
      startX: number;
      startY: number;
      endX: number;
      endY: number;
    };

export class Logic {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private existingShapes: Shape[];
  private roomId: string;
  private socket: WebSocket;
  private clicked: boolean;
  private startX: number;
  private startY: number;
  private selectedTool: Tool = "circle";

  constructor(canvas: HTMLCanvasElement, roomId: string, socket: WebSocket) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d")!;
    this.existingShapes = [];
    this.roomId = roomId;
    this.socket = socket;
    this.clicked = false;
    this.startX = 0;
    this.startY = 0;
    this.init();
    this.initHandlers();
    this.initMouseHandlers();
  }

  setTool(tool: Tool) {
    this.selectedTool = tool;
  }

  async init() {
    this.existingShapes = await getExistingShapes(this.roomId);
  }

  initHandlers() {
    this.socket.onmessage = (event) => {
      const parsedData = JSON.parse(event.data);

      if (parsedData.type === "chat") {
        const parsedShape = JSON.parse(parsedData.message);

        console.log("Parsed Shape:", parsedShape);

        this.existingShapes.push(parsedShape);
        this.clearCanvas();
      }
    };
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = "rgba(0, 0, 0)";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.existingShapes.map((shape) => {
      if (shape.type === "rect") {
        this.ctx.strokeStyle = "rgba(255, 255, 255)";
        this.ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
      }
    });
  }

  initMouseHandlers() {
    this.canvas?.addEventListener("mousedown", (e) => {
      this.clicked = true;
      this.startX = e.clientX;
      this.startY = e.clientY;
    });

    this.canvas?.addEventListener("mouseup", (e) => {
      this.clicked = false;
      const width = e.clientX - this.startX;
      const height = e.clientY - this.startY;

      const shape: Shape = {
        type: "rect",
        x: this.startX,
        y: this.startY,
        height,
        width,
      };
      this.existingShapes.push(shape);

      this.socket.send(
        JSON.stringify({
          type: "chat",
          message: JSON.stringify(shape),
          roomId: this.roomId,
        })
      );
    });

    this.canvas?.addEventListener("mousemove", (e) => {
      if (this.clicked) {
        const width = e.clientX - this.startX;
        const height = e.clientY - this.startY;

        this.clearCanvas();
        this.ctx.strokeStyle = "rgba(255, 255, 255)";
        this.ctx.strokeRect(this.startX, this.startY, width, height);
      }
    });
  }
}
