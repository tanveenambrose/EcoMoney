import React, { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export const Card = ({ children, className = "" }: CardProps) => {
  return (
    <div className={"animated-border-wrapper"}>
      <div
        className={
          "animated-border-inner rounded-2xl shadow-md border border-green-200 " + className
        }
      >
        {children}
      </div>
    </div>
  );
};

export const CardContent = ({ children, className = "" }: CardProps) => {
  return (
    <div className={"p-4 " + className}>
      {children}
    </div>
  );
};

export default Card;
