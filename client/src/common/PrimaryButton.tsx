import React from "react";

type buttonTypes = {
  children: React.ReactNode;
  className: string;
};
const Button: React.FC<buttonTypes> = ({ children, className }) => {
  return <button className={className}>{children}</button>;
};
const PrimaryButton = React.memo(Button) || Button;
export default PrimaryButton;
