import { create } from "zustand";

export type TxType = "income" | "expense";

export interface Transaction {
  id: string;
  name: string;
  category: string;
  date: string;
  amount: number;
  note?: string;
  type: TxType;
}

interface MoneyStore {
  transactions: Transaction[];
  addTransaction: (tx: Transaction) => void;
}

export const useMoneyStore = create<MoneyStore>((set) => ({
  transactions: [
    {
      id: "1",
      name: "Rent",
      category: "Housing",
      date: "2025-11-24",
      amount: 1200,
      type: "expense",
    },
    {
      id: "2",
      name: "Groceries",
      category: "Food",
      date: "2025-11-23",
      amount: 250,
      type: "expense",
    },
  ],

  addTransaction: (tx: Transaction) =>
    set((state) => ({
      transactions: [tx, ...state.transactions],
    })),
}));
