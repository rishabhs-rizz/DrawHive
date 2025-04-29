import { Button } from "./button";

interface Inputprop {
  placeHolder: string;
  type?: string;
  className: string;
  onchange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const Input = ({
  placeHolder,
  type,
  className,
  onchange,
}: Inputprop) => {
  return (
    <input
      type={type}
      placeholder={placeHolder}
      className={className}
      onChange={onchange}
    />
  );
};
