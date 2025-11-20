import { ArrowRight } from 'lucide-react'
import React from 'react'

export default function Home() {
  return (

   <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <header className="flex justify-between items-center p-6 max-w-7xl mx-auto">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <svg
            className="w-8 h-8 text-teal-500"
            fill="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Simple placeholder for a logo/icon, perhaps a coin or tracking symbol */}
            <circle cx="12" cy="12" r="10" />
            <path
              fill="white"
              d="M10 16.5l6-4.5-6-4.5v9z"
            />
          </svg>
          <span className="text-xl font-bold text-gray-800">EcoMoney</span>
        </div>

        {/* Navigation/Actions */}
        <nav className="flex items-center space-x-4">
          <a
            href="/sign-in"
            className="text-gray-600 hover:text-gray-800 font-medium transition duration-150"
          >
            Sign In
          </a>
          <a
            href="/get-started"
            className="px-4 py-2 bg-teal-500 text-white font-semibold rounded-lg shadow-md hover:bg-teal-600 transition duration-150"
          >
            Get Started
          </a>
        </nav>
      </header>
      
      {/* Main Content / Hero Section */}
      <main className="flex flex-col items-center justify-center text-center pt-24 pb-32">
        {/* Faded Background/Glow effect wrapper */}
        <div className="relative w-full max-w-4xl mx-auto">
          {/* Subtle background gradient glow - similar to the design */}
          <div className="absolute inset-0 m-auto w-3/4 h-3/4 bg-teal-500 opacity-10 rounded-full blur-3xl -z-10"/> 
          <div className="relative z-10 px-6">
            {/* Tagline */}
            <div className="inline-flex items-center px-4 py-2 mb-8 bg-green-50 text-green-700 text-sm font-medium rounded-full shadow-inner">
              <span className="mr-2 transform rotate-45">✈️</span> {/* Using a simple emoji, similar to the small icon in the design */}
              Your Personal Finance Assistant
            </div>

         
            <h1 className="text-6xl sm:text-7xl font-extrabold text-gray-900 leading-tight mb-6">
              Take Control of Your{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500



       ">
                Money Journey
              </span>
            </h1>

            <p className="text-xl text-gray-600 max-w-xl mx-auto mb-12">
              Track every taka, visualize your spending, and achieve your
              financial goals with our beautiful and intuitive money management app.
            </p>

            {/* Action Buttons */}
            <div className="flex justify-center space-x-4">
              {/* Start Tracking Free Button (Primary) */}
              <a
                href="/start-tracking"
                className="inline-flex items-center px-8 py-4 bg-linear-to-r from-blue-400 to-blue-600 text-white font-semibold text-lg rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.05] transition duration-500 ease-in-out"
              >
                Safe ৳ Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </a>

              <button
                type="button"
                className="px-8 py-4 bg-white text-gray-700 font-semibold text-lg border border-gray-400 rounded-xl shadow-md hover:bg-green-300 transition duration-300 ease-in-out"
              >
                Watch Demo
              </button>
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer or additional sections can go here */}
    </div>
  )
}

