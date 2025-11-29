

interface Props {
  current: string;
  setCurrent: (v: "all" | "income" | "expense") => void;
}

export default function TransactionFilters({ current, setCurrent }: Props) {
  return (
     
    <div className="flex gap-3">
      {["all", "income", "expense"].map((filter) => (
        <button
        
          key={filter}
          onClick={() => setCurrent(filter as "all" | "income" | "expense")}
          className={`px-4 py-2 rounded-xl capitalize transition 
            ${
              current === filter
               
                ? filter === "income"
                  ? "bg-green-700/70"
                  
                  : filter === "expense"
                  ? "bg-rose-700/40"
                  : "bg-orange-700"
                : "bg-slate-800/70"
            }`}
        >
          {filter}
          
        </button>
      ))}

    </div>
    
  );
}
