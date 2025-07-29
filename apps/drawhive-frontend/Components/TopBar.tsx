import {
  Circle,
  Eraser,
  Slash,
  Type,
  Pencil,
  RectangleHorizontal,
} from "lucide-react";
import { IconsButtons } from "./IconsButtons";
import { Tool } from "./Canvas";

export default function TopBar({
  selectedTool,
  SetselectedTool,
}: {
  selectedTool: Tool;
  SetselectedTool: (tool: Tool) => void;
}) {
  return (
    <div className="fixed top-8 left-1/2 -translate-x-1/2 px-5 py-2 flex items-center space-x-2 rounded-xl bg-[#2c2c32] text-white shadow-md border border-gray-700 backdrop-blur-sm">
      <IconsButtons
        activated={selectedTool === "pencil"}
        icons={<Pencil size={20} />}
        onClick={() => SetselectedTool("pencil")}
      />
      <IconsButtons
        activated={selectedTool === "line"}
        icons={<Slash size={20} />}
        onClick={() => SetselectedTool("line")}
      />
      <IconsButtons
        activated={selectedTool === "text"}
        icons={<Type size={20} />}
        onClick={() => SetselectedTool("text")}
      />
      <IconsButtons
        activated={selectedTool === "eraser"}
        icons={<Eraser size={20} />}
        onClick={() => SetselectedTool("eraser")}
      />
      <IconsButtons
        activated={selectedTool === "circle"}
        icons={<Circle size={20} />}
        onClick={() => SetselectedTool("circle")}
      />
      <IconsButtons
        activated={selectedTool === "rect"}
        icons={<RectangleHorizontal size={20} />}
        onClick={() => SetselectedTool("rect")}
      />
    </div>
  );
}
