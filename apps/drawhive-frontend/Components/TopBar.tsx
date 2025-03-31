import { Circle, Eraser, Pencil, RectangleHorizontal } from "lucide-react";
import { IconsButtons } from "./IconsButtons";
import { useState } from "react";

type Tool = "rect" | "circle" | "pencil" | "eraser";

export default function TopBar() {
  const [selectedTool, SetselectedTool] = useState<Tool>("rect");

  return (
    <div className="bg-[#232329] py-2 px-4 rounded-[10px] top-8 left-[46%] text-white fixed gap-3 flex justify-center items-center">
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
