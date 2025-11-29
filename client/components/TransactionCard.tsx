import { Transaction } from "@/store/useMoneyStore";

export default function TransactionCard({ tx }: { tx: Transaction }) {
  return (
    <div className="bg-slate-800/40 border border-slate-700 rounded-2xl p-5 flex justify-between items-center">
      <div>
        <h3 className="font-semibold text-lg">{tx.name}</h3>
        <p className="text-sm text-slate-400">{tx.category}</p>
        <p className="text-xs text-slate-500">
          {new Date(tx.date).toDateString()}
        </p>
      </div>

      <strong
        className={`text-lg ${
          tx.type === "expense" ? "text-rose-400" : "text-emerald-400"
        }`}
      >
        {tx.type === "expense" ? "-" : "+"}৳{tx.amount}
      </strong>
    </div>
  );
}
