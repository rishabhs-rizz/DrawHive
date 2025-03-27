import { Button } from "./button";

interface Inputprop {
  placeHolder: string;
  type?: string;
  className: string;
}

export const Input = ({ placeHolder, type, className }: Inputprop) => {
  return <input type={type} placeholder={placeHolder} className={className} />;
};
