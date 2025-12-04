import { motion } from "framer-motion";

interface Props {
  current: string;
  setCurrent: (v: "all" | "income" | "expense") => void;
}

export default function TransactionFilters({ current, setCurrent }: Props) {
  const filters = ["all", "income", "expense"];

  return (
    <div className="flex gap-2 p-1 bg-slate-800/50 rounded-xl w-fit border border-white/5">
      {filters.map((filter) => {
        const isActive = current === filter;
        return (
          <button
            key={filter}
            onClick={() => setCurrent(filter as "all" | "income" | "expense")}
            className={`relative px-4 md:px-6 py-2 rounded-lg text-sm font-bold capitalize transition-colors z-10 ${
              isActive ? "text-white" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            {isActive && (
              <motion.div
                layoutId="activeFilter"
                className={`absolute inset-0 rounded-lg -z-10 shadow-sm ${
                  filter === 'income' ? 'bg-emerald-600' : 
                  filter === 'expense' ? 'bg-rose-600' : 'bg-slate-600'
                }`}
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            {filter}
          </button>
        );
      })}
    </div>
  );
}