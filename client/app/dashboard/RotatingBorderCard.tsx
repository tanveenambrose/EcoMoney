import React from "react";

export default function RotatingBorderCard({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative p-0.5 rounded-2xl overflow-hidden">
      {/* Border Animation */}
      <div className="absolute inset-0 rounded-2xl border-[3px] border-transparent animate-rotate-border bg-[conic-gradient(from_var(--angle),#ff0040,#00ccff,#ffcc00,#ff0040)]"></div>

      {/* Card Content */}
      <div className="relative z-10 bg-white rounded-2xl h-full w-full">
        {children}
      </div>
    </div>
  );
}
