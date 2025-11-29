"use client";

import { Calendar } from "lucide-react";

export default function TransactionSearchBar() {
  return (
    <div className="w-full bg-white/10 border border-white/10 p-4 rounded-2xl flex gap-4  ">

      {/* SEARCH */}
      <input
        placeholder="Search transactions..."
        className="flex-1 bg-white/5 border border-white/10 px-4 py-2 rounded-xl outline-none focus:ring-1 focus:ring-emerald-500 mr-30"
      />

      
      

      {/* DATE PICKER */}
      <div className="min-w-[200px] bg-white/9 border border-blue-500 px-4 py-3 rounded-xl flex items-center justify-between cursor-pointer ">
        <input
          type="date"
          className="bg-transparent w-full outline-none pl-20 mr-10"
        />
        <Calendar size={1}  />
      </div>

    </div>
  );
}
