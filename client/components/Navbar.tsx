'use client';

import React, { useState, useContext } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
// Import Sun and Moon icons
import { LayoutGrid, ReceiptText, Settings, LogOut, Menu, X, Sun, Moon } from 'lucide-react';
import { AppContext } from '@/context/AppContext';
import { toast } from 'react-toastify';
// Import the useTheme hook
import { useTheme } from '@/context/ThemeContext';
import Button from './ui/button';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Get theme and toggle function from context
  const { theme, toggleTheme } = useTheme();

  const { backendUrl, setIsLoggedIn, setUserData, userData } = useContext(AppContext) as any;

  const isActive = (path: string) => pathname === path;
  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const handleLogout = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/auth/logout`, { method: 'POST', credentials: 'include' });
      if (response.ok) {
        setIsLoggedIn(false);
        setUserData(null);
        router.replace('/'); 
        toast.success("Logged out successfully");
      } else {
        toast.error("Logout failed");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  return (
    // Updated with dark mode classes for background, border, and text
    <nav className="w-full bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 sticky top-0 z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center group z-50 gap-2">
          <div className="rounded-full flex items-center justify-center text-white font-bold text-2xl group-hover:scale-105 transition-transform">
            <img src="/logo.svg" alt="EcoMoney Logo" className="w-14" /> 
          </div>
          {/* Updated text color for dark mode */}
          <span className="text-lg md:text-xl font-bold text-slate-900 dark:text-white tracking-tight">EcoMoney</span>
        </Link>

        <div className="hidden lg:flex items-center gap-2">
          <NavItem href="/dashboard" icon={<LayoutGrid size={18} />} label="Dashboard" active={isActive('/dashboard')} />
          <NavItem href="/transaction" icon={<ReceiptText size={18} />} label="Transactions" active={isActive('/transactions')} />
          <NavItem href="/categories" icon={<Settings size={18} />} label="Categories" active={isActive('/categories')} />
        </div>

        <div className="flex items-center gap-3 md:gap-4">
          
          {/* --- Theme Toggle Button --- */}
          <button
      onClick={() => toggleTheme()}
      title="Toggle theme"
      className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
    >
      {/* Show Sun icon when in dark mode, Moon when in light mode */}
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute top-5 h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </button>
          {/* --------------------------- */}

          <Link href="/profile" className="relative group">
            {/* Updated border color for dark mode */}
            <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-white dark:border-slate-700 shadow-sm overflow-hidden transition-all hover:border-emerald-400 dark:hover:border-emerald-500 hover:shadow-md shrink-0">
              <img 
                key={userData?.image || 'default-img'}
                src={userData?.image || "https://placehold.co/400x400?text=User"} 
                alt="Profile" 
                className="w-full h-full object-cover"
                crossOrigin="anonymous" 
              />
            </div>
          </Link>

          <div className="hidden lg:block">
            <button onClick={handleLogout} className="flex items-center gap-2 text-slate-400 hover:text-rose-500 transition-colors text-sm font-medium px-3 py-2">
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>

          {/* Updated mobile menu button colors */}
          <button className="lg:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors" onClick={toggleMenu}>
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      
      {/* Mobile Menu - Updated with dark mode classes */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-16 left-0 w-full bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 shadow-lg flex flex-col p-4 gap-2 animate-in slide-in-from-top-5">
           <NavItem href="/dashboard" icon={<LayoutGrid size={18} />} label="Dashboard" active={isActive('/dashboard')} onClick={() => setIsMobileMenuOpen(false)} className="w-full justify-start" />
           <NavItem href="/transaction" icon={<ReceiptText size={18} />} label="Transactions" active={isActive('/transactions')} onClick={() => setIsMobileMenuOpen(false)} className="w-full justify-start" />
           <NavItem href="/categories" icon={<Settings size={18} />} label="Categories" active={isActive('/categories')} onClick={() => setIsMobileMenuOpen(false)} className="w-full justify-start" />
           <div className="h-px bg-slate-100 dark:bg-slate-800 my-2"></div>
           <button onClick={handleLogout} className="flex w-full items-center gap-2.5 px-5 py-3 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 hover:text-rose-600 transition-colors text-sm font-medium">
             <LogOut size={18} /><span>Logout</span>
           </button>
        </div>
      )}
    </nav>
  );
}

// Updated NavItem for dark mode
type NavItemProps = { href: string; icon: React.ReactNode; label: string; active: boolean; className?: string; onClick?: () => void; };
function NavItem({ href, icon, label, active, className = '', onClick }: NavItemProps) {
  return (
    <Link 
      href={href} 
      onClick={onClick} 
      // Conditional classes for active/inactive states in both light and dark modes
      className={`flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
        active 
          ? 'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white' 
          : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800/50 dark:hover:text-slate-200'
      } ${className}`}
    >
      {icon} {label}
    </Link>
  );
}