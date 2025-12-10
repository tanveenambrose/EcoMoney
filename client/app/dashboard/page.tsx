"use client";

import React, { useContext, useEffect } from "react";
import RotatingBorderCard from "./RotatingBorderCard";
import Card, { CardContent } from "@/components/ui/card";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  PiggyBank,
} from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import Navbar from "@/components/Navbar";
import { AppContext } from "@/context/AppContext";

// Updated unique and eye-catching color palette for the pie chart
const data = [
  { name: "Housing", value: 55, color: "#3B82F6" }, // Blue (Primary)
  { name: "Food", value: 19, color: "#10B981" }, // Emerald (Secondary)
  { name: "Utilities", value: 12, color: "#F59E0B" }, // Amber
  { name: "Transport", value: 6, color: "#8B5CF6" }, // Violet
  { name: "Entertainment", value: 5, color: "#EC4899" }, // Pink
];

export default function Dashboard() {
  const [open, setOpen] = React.useState(false);

  // 1. Get User Data from Context
  const { userData, getUserData } = useContext(AppContext) as any;

  // 2. Fetch fresh data on component mount
  useEffect(() => {
    if (getUserData) {
      getUserData();
    }
  }, []);

  // 3. Extract Financial Data (Default to 0 if loading/null)
  const earnings = userData?.totalEarnings || 0;
  const spending = userData?.totalSpending || 0;
  const savings = userData?.totalSavings || 0;

  // Backend provides this, but we fallback to calculation if needed
  const balance = userData?.totalBalance ?? (earnings - (spending + savings));

  return (
    <>
      <Navbar />
      {/* Main container with responsive padding and a slight background color for better contrast */}
      <div className="w-full min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8 lg:p-10 space-y-6 md:space-y-10 lg:space-y-20 text-gray-800">
        
        {/* Top Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mt-4">
          
          {/* Total Balance Card */}
          <div className="flex items-center gap-4 p-4 sm:p-5 rounded-2xl shadow-sm border border-blue-100 transition duration-300 hover:shadow-md hover:-translate-y-0.5 bg-white">
            <div className="bg-blue-100 p-3 rounded-xl">
              <Wallet className="text-blue-600 w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <div>
              <p className="text-gray-500 text-xs sm:text-sm font-medium">Total Balance</p>
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-blue-900 truncate">৳{balance.toLocaleString()}</h2>
            </div>
          </div>

          {/* Total Earnings Card */}
          <Card className="rounded-2xl shadow-sm border border-emerald-100 transition duration-300 hover:shadow-md hover:-translate-y-0.5 bg-white">
            <CardContent className="p-4 sm:p-5">
              <div className="flex items-center gap-4">
                <div className="bg-emerald-100 p-3 rounded-xl">
                  <TrendingUp className="text-emerald-600 w-6 h-6 sm:w-7 sm:h-7" />
                </div>
                <div>
                  <p className="text-gray-500 text-xs sm:text-sm font-medium">Total Earnings</p>
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-emerald-900 truncate">৳{earnings.toLocaleString()}</h2>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Total Spending Card */}
          <Card className="rounded-2xl shadow-sm border border-rose-100 transition duration-300 hover:shadow-md hover:-translate-y-0.5 bg-white">
            <CardContent className="p-4 sm:p-5">
              <div className="flex items-center gap-4">
                <div className="bg-rose-100 p-3 rounded-xl">
                  <TrendingDown className="text-rose-600 w-6 h-6 sm:w-7 sm:h-7" />
                </div>
                <div>
                  <p className="text-gray-500 text-xs sm:text-sm font-medium">Total Spending</p>
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-rose-900 truncate">৳{spending.toLocaleString()}</h2>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Total Savings Card */}
          <Card className="rounded-2xl shadow-sm border border-amber-100 transition duration-300 hover:shadow-md hover:-translate-y-0.5 bg-white">
            <CardContent className="p-4 sm:p-5">
              <div className="flex items-center gap-4">
                <div className="bg-amber-100 p-3 rounded-xl">
                  <PiggyBank className="text-amber-600 w-6 h-6 sm:w-7 sm:h-7" />
                </div>
                <div>
                  <p className="text-gray-500 text-xs sm:text-sm font-medium">Total Savings</p>
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-amber-900 truncate">৳{savings.toLocaleString()}</h2>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Middle Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          
          {/* Left Pie Chart Card */}
          <RotatingBorderCard>
            <Card className="rounded-2xl shadow-sm h-full min-h-[400px] sm:min-h-[450px] bg-white">
              <CardContent className="p-4 sm:p-6 h-full flex flex-col">
                <h3 className="text-lg sm:text-xl font-bold mb-4 text-gray-900 text-center sm:text-left">Spending by Category</h3>
                <div className="grow flex justify-center items-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={data}
                        dataKey="value"
                        cx="50%"
                        cy="50%"
                        outerRadius="80%"
                        label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                        labelLine={false}
                      >
                        {data.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} stroke="#fff" strokeWidth={2} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                        itemStyle={{ color: '#374151', fontWeight: 500 }}
                        formatter={(value: number) => [`${value}%`, 'Percentage']}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </RotatingBorderCard>

          {/* Right Transactions Section */}
          <div className="flex flex-col gap-6">
            
            {/* Recent Transactions Card */}
            <Card className="rounded-2xl shadow-sm border border-gray-200 bg-white">
              <CardContent className="p-4 sm:p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900">Recent Transactions</h3>
                  <button
                    onClick={() => setOpen(true)}
                    className="px-4 py-1.5 rounded-full text-blue-600 text-xs sm:text-sm font-semibold bg-blue-50 border border-blue-100 hover:bg-blue-100 hover:text-blue-700 transition-colors"
                  >
                    View All
                  </button>
                </div>
                <div className="text-center py-8 sm:py-10 text-gray-400 text-sm sm:text-base font-medium">
                  No transactions yet
                </div>
              </CardContent>
            </Card>

            {/* Spending by Category (List View) Card */}
            <Card className="rounded-2xl shadow-sm border border-gray-200 bg-white grow">
              <CardContent className="p-4 sm:p-6 h-full">
                <h3 className="text-lg sm:text-xl font-bold mb-6 text-gray-900">Spending Breakdown</h3>
                <div className="text-center py-8 sm:py-10 text-gray-400 text-sm sm:text-base font-medium">
                  No expenses yet
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* ------ MODAL ------ */}
        {open && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
            <div className="bg-white p-5 sm:p-6 rounded-2xl w-full max-w-md shadow-xl mx-4">
              <h2 className="text-xl sm:text-2xl font-bold mb-4 text-gray-900">All Transactions</h2>
              <p className="text-gray-500 mb-8 text-sm sm:text-base">You have no transactions yet.</p>
              <button
                onClick={() => setOpen(false)}
                className="bg-gray-900 text-white px-4 py-2.5 rounded-xl hover:bg-gray-800 font-semibold text-sm sm:text-base w-full transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}

      </div>
    </>
  );
}