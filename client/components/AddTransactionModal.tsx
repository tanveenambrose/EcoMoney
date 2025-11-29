"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { useMoneyStore } from "@/store/useMoneyStore";

export default function AddTransactionModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const addTransaction = useMoneyStore((s) => s.addTransaction);

  const [type, setType] = useState<"income" | "expense">("expense");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [note, setNote] = useState("");

  if (!open) return null;

  const handleSubmit = () => {
    if (!amount || !category) return;

    addTransaction({
      id: Date.now().toString(),
      name: category,
      category,
      amount: Number(amount),
      date,
      note,
      type,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-999 px-4">
      <div className="w-full max-w-lg bg-slate-900 rounded-2xl shadow-2xl p-6 relative border border-white/10">

        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Add Transaction</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10"
          >
            <X size={22} />
          </button>
        </div>

        {/* Type */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setType("income")}
            className={`flex-1 py-3 rounded-xl border text-center ${
              type === "income"
                ? "bg-emerald-600 border-emerald-500"
                : "bg-slate-800 border-slate-700"
            }`}
          >
            Income
          </button>

          <button
            onClick={() => setType("expense")}
            className={`flex-1 py-3 rounded-xl border text-center ${
              type === "expense"
                ? "bg-rose-600 border-rose-500"
                : "bg-slate-800 border-slate-700"
            }`}
          >
            Expense
          </button>
        </div>

        {/* Amount */}
        <div className="mb-4">
          <label className="text-sm text-white/60">Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full mt-2 bg-slate-800 border border-slate-700 px-4 py-3 rounded-xl outline-none"
            placeholder="$ 0.00"
          />
        </div>

        {/* Category */}
        <div className="mb-4">
          <label className="text-sm text-white/60">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full mt-2 bg-slate-800 border border-slate-700 px-4 py-3 rounded-xl"
          >
            <option value="">Select category</option>
            <option value="Rent">Rent</option>
            <option value="Groceries">Groceries</option>
            <option value="Food">Food</option>
            <option value="Bills">Bills</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Date */}
        <div className="mb-4">
          <label className="text-sm text-white/60">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full mt-2 bg-slate-800 border border-slate-700 px-4 py-3 rounded-xl"
          />
        </div>

        {/* Note */}
        <div className="mb-6">
          <label className="text-sm text-white/60">Note</label>
          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full mt-2 bg-slate-800 border border-slate-700 px-4 py-3 rounded-xl"
            placeholder="Enter description"
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl bg-slate-700/50 hover:bg-slate-600/60"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700"
          >
            Add Transaction
          </button>
        </div>
      </div>
    </div>
  );
}
