import React from "react";

export default function RotatingBorder({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative p-0.5 rounded-2xl overflow-hidden">
      
      {/* Smooth RGB Border Animation */}
     <div className="
  absolute inset-0 rounded-2xl border-[3px] border-transparent 
  animate-rotate-border
  bg-[conic-gradient(from_var(--angle),red,magenta,blue,cyan,lime,yellow,red)]
  blur-[2px]                
  before:absolute
  before:inset-0
  before:rounded-2xl
  before:bg-[conic-gradient(from_var(--angle),red,magenta,blue,cyan,lime,yellow,red)]
  before:blur-[15px]       
  before:opacity-70
  before:z-[-1]
"></div>


      {/* Content */}
      <div className="relative z-10 bg-gray-600 rounded-2xl h-full w-full">
        {children}
      </div>
      
    </div>
  );
}
