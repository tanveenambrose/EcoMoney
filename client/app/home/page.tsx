"use client";

import { ArrowRight } from 'lucide-react'
import React from 'react'
import { motion, easeInOut, easeOut } from 'framer-motion'

// --- Typewriter Component ---
type TypewriterProps = {
  text: string;
  delay?: number;
};

const Typewriter: React.FC<TypewriterProps> = ({ text, delay = 0.2 }) => {
  // Split the text into an array of characters
  const characters = Array.from(text);

  // Variant for each character (letter)
  const charVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.2 } },
  };

  // Variant for the container to stagger the characters
  const container = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: delay, // Control the speed of the typing effect
      },
    },
  };

  return (
    <motion.div
      className="inline" // Use inline to keep the text flow natural
      variants={container}
      initial="hidden"
      animate="visible"
    >
      {characters.map((char, index) => (
        <motion.span 
          key={index} 
          variants={charVariants}
          // Preserve spaces to maintain proper word separation
          style={{ whiteSpace: char === ' ' ? 'pre' : 'normal' }}
        >
          {String(char)}
        </motion.span>
      ))}
    </motion.div>
  );
};
// --- End Typewriter Component ---


// --- Existing Variants ---
const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.2 } },
};

const glowVariants = {
  animate: {
    scale: [1, 1.1, 1],
    opacity: [0.7, 0.9, 0.7],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: easeInOut,
    },
  },
};

const fadeSlideUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: easeOut } },
};

const buttonHover = {
  hover: { scale: 1.05, boxShadow: '0px 4px 15px rgba(59, 130, 246, 0.4)' },
};
// --- End Existing Variants ---


export default function Home() {
  const subtitleText = "Track every taka, visualize your spending, and achieve your financial goals with our beautiful and intuitive money management app.";

  return (
    // Base container is fine, using light gray background
    <div className="min-h-screen bg-gray-50 font-sans">
      
      {/* Header: Max-width and padding ensure responsiveness */}
      <header className="flex justify-between items-center p-4 sm:p-6 max-w-7xl mx-auto">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <svg
            className="w-7 h-7 sm:w-8 sm:h-8 text-teal-500"
            fill="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Simple placeholder for a logo/icon */}
            <circle cx="12" cy="12" r="10" />
            <path
              fill="white"
              d="M10 16.5l6-4.5-6-4.5v9z"
            />
          </svg>
          <span className="text-xl font-bold text-gray-800">EcoMoney</span>
        </div>

        {/* Navigation/Actions: Uses flex and spacing for all screens */}
        <nav className="flex items-center space-x-3 sm:space-x-4">
          <a
            href="/sign-in"
            className="text-sm sm:text-base text-gray-600 hover:text-gray-800 font-medium transition duration-150"
          >
            Sign In
          </a>
          <a
            href="/get-started"
            className="px-3 py-1.5 sm:px-4 sm:py-2 bg-teal-500 text-white font-semibold text-sm sm:text-base rounded-lg shadow-md hover:bg-teal-600 transition duration-150"
          >
            Get Started
          </a>
        </nav>
      </header>
      
      {/* Main Content / Hero Section: Increased top padding for mobile screens */}
      <main className="flex flex-col items-center justify-center text-center pt-16 sm:pt-24 pb-32 px-4">
        
        {/* Faded Background/Glow effect wrapper */}
        <motion.div
          className="relative w-full max-w-4xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Subtle background glow FIX: This large, blurred element creates the diffused background effect */}
          <motion.div
            className="absolute inset-0 m-auto w-[200px] sm:w-[400px] lg:w-[600px] h-[200px] sm:h-[400px] lg:h-[600px] bg-emerald-100 opacity-70 rounded-full blur-3xl -z-10"
            variants={glowVariants}
            animate="animate"
          />
          <motion.div className="relative z-10">
            {/* Tagline */}
            <div
              className="inline-flex items-center px-4 py-2 mb-8 bg-green-50 text-green-700 text-sm font-medium rounded-full shadow-inner"
            >
              
              <motion.span className="mr-2 transform rotate-45"
                variants={fadeSlideUp}
                initial={{ x: -300 }}
                animate={{ x: 0 } }
                transition={{ duration: 3, ease: easeOut }}
              >✈️</motion.span>
            
              <motion.div 
                className="text-sm sm:text-base"
                variants={fadeSlideUp}
                initial={{ x: 300 }}
                animate={{ x: 0 } }
                transition={{ duration: 3, ease: easeOut }}
              >
                Your Personal Finance Assistant
              </motion.div>
              

            </div>

            {/* Responsive Heading: Scales from text-5xl (mobile) up to text-7xl (desktop) */}
            <motion.h1
              className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-gray-900 leading-tight mb-6"
              variants={fadeSlideUp}
              initial={{ y: -400, opacity:0 }}
              animate={{ y: 0, opacity: 100} } // Changed animate to y: 0 for consistency
              transition={{ duration: 4, ease: easeOut }}>
              Take Control of Your{' '}
            </motion.h1>
            
            <motion.h1 className='text-5xl sm:text-6xl lg:text-7xl font-extrabold text-gray-900 leading-tight mb-6'
              variants={fadeSlideUp}
              initial={{ opacity: 0, y: 400 }}
              animate={{ y: 0, opacity:100 } } // Changed animate to y: 0 for consistency
              transition={{ duration: 4, ease: easeOut }}
            >
              <span className="whitespace-nowrap text-transparent bg-clip-text bg-linear-to-r from-emerald-400 to-teal-500"
              >
                Money Journey
              </span>
            </motion.h1>

            {/* Responsive Subtitle: Now uses the Typewriter component */}
            <p
              className="text-lg sm:text-xl text-gray-600 max-w-xl mx-auto mb-10 sm:mb-12 min-h-[3.5em]" // Added min-height to prevent layout shift
              // Note: We remove the 'motion' wrapper here and use the inner Typewriter component
              // The initial fadeSlideUp transition for the P tag is no longer needed.
            >
                <Typewriter text={subtitleText} delay={0.03} /> {/* Adjust delay for speed */}
            </p>

            {/* Action Buttons: Stacks on mobile (flex-col) and becomes a row on larger screens (sm:flex-row) */}
            <motion.div
              className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4"
              variants={fadeSlideUp}
              // Added initial/animate for the buttons to slide up after the typewriter finishes
              initial="hidden"
              animate="visible"
              transition={{ delay: (subtitleText.length * 0.01) + 0.1 }} // Delay based on typewriter length + a pause
            >
              {/* Primary Button FIX: Corrected gradient class and colors */}
              <motion.a
                href="/start-tracking"
                className="inline-flex text-center px-8 py-4 bg-linear-to-r from-green-400 to-teal-500 text-white font-semibold text-lg rounded-xl shadow-lg md:items-center hover:shadow-xl transform transition duration-500 ease-in-out"
                
                 variants={fadeSlideUp}
                initial={{opacity:0, x: -400 }}
                animate={{ x: 0 } }
                transition={{ duration: 1, ease: 'easeInOut' }}
                
                whileHover={buttonHover.hover}
                whileTap={{ scale: 0.95 }}
              >
                Start Tracking Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </motion.a>

              {/* Secondary Button FIX: Adjusted styles for visual consistency */}
              <motion.button
                type="button"
                className="px-8 py-4 bg-white text-gray-700 font-semibold text-lg border border-gray-200 rounded-xl shadow-md hover:bg-gray-50 transition duration-300 ease-in-out"
           
                variants={fadeSlideUp}
                initial={{ x: 400 }}
                animate={{ x: 0 } }
                transition={{ duration: 1, ease: 'easeInOut' }}

                whileHover={buttonHover.hover}
                whileTap={{ scale: 0.95 }}
              >
                Watch Demo
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.div>
      </main>
      
      {/* Footer or additional sections can go here */}
    </div>
  )
}