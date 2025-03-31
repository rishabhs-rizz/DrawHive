import { ReactNode } from "react";

export function IconsButtons({
  icons,
  onClick,
  activated,
}: {
  icons: ReactNode;
  onClick: () => void;
  activated: boolean;
}) {
  return (
    <div
      className={`h-[50%l p-1 rounded-[6px] ${activated ? "bg-purple-700" : "bg-[#232329]"} hover:bg-purple-700 cursor-pointer`}
      onClick={onClick}
    >
      {icons}
    </div>
  );
}
