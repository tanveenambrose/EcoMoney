"use client";

import React from "react";
import RotatingBorderCard from "./RotatingBorderCard";




// Fallback Button component to avoid the "Cannot find module '@/components/ui/button'" TypeScript error.
// Replace this with the real Button component or correct import path when your UI library is available.
const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ children, className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button className={className} {...props}>{children}</button>
);

import Card, { CardContent } from "@/components/ui/card";

// Fallback Card/CardContent components to avoid the "Cannot find module '@/components/ui/card'" TypeScript error.
// Replace these with the real components or correct import path when your UI library is available.
/* 
const Card: React.FC<React.ComponentProps<'div'>> = ({ children, className, ...props }: React.ComponentProps<'div'>) => (
  <div className={className} {...props}>{children}</div>
);
const CardContent: React.FC<React.ComponentProps<'div'>> = ({ children, className, ...props }: React.ComponentProps<'div'>) => (
  <div className={className} {...props}>{children}</div>
);
*/
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  Plus,
} from "lucide-react";
import { PieChart, Pie, Cell, Tooltip } from "recharts";

const data = [
  { name: "Housing", value: 55, color: "#FF5467" },
  { name: "Food", value: 19, color: "#FF8EA1" },
  { name: "Utilities", value: 12, color: "#FFA5B5" },
  { name: "Transport", value: 6, color: "#FFBFC8" },
  { name: "Entertainment", value: 5, color: "#FFA84D" },
];


export default function Dashboard() {
  return (
    <div className="w-full p-10 space-y-20">
      {/* Top Summary Cards */}
      <div className="grid grid-cols-2 mt-4 md:grid-cols-4 gap-4">
       
          <div className="flex items-center gap-3 p-5 rounded-2xl shadow-md border border-blue-200 transition duration-300 hover:shadow-lg hover:-translate-y-0.5 hover:border-green-400">
            <div className="bg-green-100 p-3 rounded-xl">
              <Wallet className="text-green-600" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Total Balance</p>
              <h2 className="text-xl font-semibold">৳32,200</h2>
            </div>
          </div>
        

        <Card className="rounded-2xl shadow-md border border-teal-200 transition duration-300 hover:shadow-lg hover:-translate-y-0.5 hover:border-green-400">
          <CardContent className="p-5 ">
            <div className="flex items-center gap-3  ">
              <div className="bg-green-100 p-3 rounded-xl ">
                <TrendingUp className="text-green-600" />
              </div>
              <div className="">
                <p className="text-gray-500 text-sm">Total Earnings</p>
                <h2 className="text-xl font-semibold">৳53,000</h2>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm border border-orange-200  transition duration-300 hover:shadow-lg hover:-translate-y-0.5  hover:border-green-500 ">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="bg-red-100 p-3 rounded-xl">
                <TrendingDown className="text-red-600" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Total Spending</p>
                <h2 className="text-xl font-semibold">৳20,800</h2>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm border border-yellow-200  transition duration-300 hover:shadow-lg hover:-translate-y-0.5  hover:border-green-500 ">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-3 rounded-xl">
                <PiggyBank className="text-green-600" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Total Savings</p>
                <h2 className="text-xl font-semibold">৳55,200</h2>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Middle Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Pie Chart Card */}
        <RotatingBorderCard>
        <Card className="rounded-2xl shadow-md ">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-4">Spending by Category</h3>
            <div className="flex justify-center">
              <PieChart width={300} height={300}>
                <Pie
                  data={data}
                  dataKey="value"
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  label
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </div>
          </CardContent>
        </Card>
        </RotatingBorderCard>

        {/* Right Transactions */}
        <Card className="rounded-2xl shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Recent Transactions</h3>
              <Button className="flex gap-2 rounded-full bg-green-500 hover:bg-green-600 text-white px-4">
                <Plus size={18} /> Add
              </Button>
            </div>

            <div className="space-y-5">
              {/* Transaction Item */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 p-3 rounded-xl">
                    <Wallet className="text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">Monthly Salary</p>
                    <p className="text-gray-500 text-sm">Salary • Nov 1, 2025</p>
                  </div>
                </div>
                <p className="text-green-600 font-semibold">+৳50,000</p>
              </div>

              {/* Rent */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-red-100 p-3 rounded-xl">
                    <TrendingDown className="text-red-600" />
                  </div>
                  <div>
                    <p className="font-medium">House Rent</p>
                    <p className="text-gray-500 text-sm">Housing • Nov 5, 2025</p>
                  </div>
                </div>
                <p className="text-red-600 font-semibold">-৳12,000</p>
              </div>

              {/* Groceries */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-pink-100 p-3 rounded-xl">
                    <TrendingDown className="text-pink-500" />
                  </div>
                  <div>
                    <p className="font-medium">Weekly Groceries</p>
                    <p className="text-gray-500 text-sm">Food • Nov 10, 2025</p>
                  </div>
                </div>
                <p className="text-red-600 font-semibold">-৳4,000</p>
              </div>

              {/* Internet Bill */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-red-100 p-3 rounded-xl">
                    <TrendingDown className="text-red-600" />
                  </div>
                  <div>
                    <p className="font-medium">Internet Bill</p>
                    <p className="text-gray-500 text-sm">Utilities • Nov 12, 2025</p>
                  </div>
                </div>
                <p className="text-red-600 font-semibold">-৳2,500</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
