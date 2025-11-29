"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { useMoneyStore } from "@/store/useMoneyStore";
import TransactionCard from "@/components/TransactionCard";
import TransactionFilters from "@/components/TransactionFilters";
import AddTransactionModal from "@/components/AddTransactionModal";
import TransactionSearchBar from "@/components/TransactionSearchBar";  // ← IMPORT IT


export default function TransactionsPage() {
  const { transactions } = useMoneyStore();
  const [filter, setFilter] = useState<"all" | "income" | "expense">("all");
  const [openModal, setOpenModal] = useState(false);

  const filteredTx = transactions.filter((tx) =>
    filter === "all" ? true : tx.type === filter
  );

  return (
    <div className="h-screen flex flex-col p-8 text-white bg-gray-900 space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-5xl font-bold bg-linear-to-r from-[#fb4444] to-[#70ff02e0] bg-clip-text text-transparent">
            Transactions
          </h1>
          <p className="text-white/70 font-semibold pb-5 ">
            Manage your income and expenses
          </p>
        </div>

        <button
          onClick={() => setOpenModal(true)}
          className="px-4 py-2 rounded-full  bg-emerald-400 hover:bg-emerald-600 text-xl transition flex gap-2 items-center shadow-md"
        >
          <Plus size={20} /> Add Transaction
        </button>
      </div>

      {/* ⬇️ Replace old input with this */}
      <TransactionSearchBar />


      {/* Filters */}
      <TransactionFilters current={filter} setCurrent={setFilter} />

      {/* Scrollable List */}
      <div className="flex-1 overflow-y-auto pr-2 space-y-4">
        {filteredTx.map((tx) => (
          <TransactionCard key={tx.id} tx={tx} />
        ))}
      </div>

      {/* Modal */}
      <AddTransactionModal
        open={openModal}
        onClose={() => setOpenModal(false)}
      />
    </div>
  );
}
