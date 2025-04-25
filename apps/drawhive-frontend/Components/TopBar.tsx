import {
  Circle,
  Eraser,
  LineChart,
  Pencil,
  PenLine,
  RectangleHorizontal,
  Slash,
  Type,
} from "lucide-react";
import { IconsButtons } from "./IconsButtons";
import { useState } from "react";
import { Tool } from "./Canvas";

export default function TopBar({
  selectedTool,
  SetselectedTool,
}: {
  selectedTool: Tool;
  SetselectedTool: (tool: Tool) => void;
}) {
  return (
    <div className="bg-[#232329] py-2 px-4 rounded-[10px] top-8 left-[46%] text-white fixed gap-3 flex justify-center items-center border border-gray-600">
      {
        <IconsButtons
          activated={selectedTool === "pencil"}
          icons={<Pencil />}
          onClick={() => {
            SetselectedTool("pencil");
          }}
        ></IconsButtons>
      }
      {
        <IconsButtons
          activated={selectedTool === "line"}
          icons={<Slash />}
          onClick={() => {
            SetselectedTool("line");
          }}
        ></IconsButtons>
      }
      {
        <IconsButtons
          activated={selectedTool === "text"}
          icons={<Type />}
          onClick={() => {
            SetselectedTool("text");
          }}
        ></IconsButtons>
      }
      {
        <IconsButtons
          activated={selectedTool === "eraser"}
          icons={<Eraser />}
          onClick={() => {
            SetselectedTool("eraser");
          }}
        ></IconsButtons>
      }
      {
        <IconsButtons
          activated={selectedTool === "circle"}
          icons={<Circle />}
          onClick={() => {
            SetselectedTool("circle");
          }}
        ></IconsButtons>
      }
      {
        <IconsButtons
          activated={selectedTool === "rect"}
          icons={<RectangleHorizontal />}
          onClick={() => {
            SetselectedTool("rect");
          }}
        ></IconsButtons>
      }
    </div>
  );
}
