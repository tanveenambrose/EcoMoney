'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutGrid, ReceiptText, Settings, LogOut, Menu, X } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Helper function to check if a link is active
  const isActive = (path: string) => pathname === path;

  // Toggle handler
  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <nav className="w-full bg-white border-b border-slate-100 sticky top-0 z-50">
      
      {/* MAIN BAR CONTAINER */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
        
        {/* LEFT: Logo Section */}
        <Link href="/dashboard" className="flex items-center group z-50 gap-2">
          <div className="rounded-full flex items-center justify-center text-white font-bold text-2xl group-hover:scale-105 transition-transform">
            {/* Ensure 'logo.svg' is inside your 'public' folder */}
            <img src="/logo.svg" alt="EcoMoney Logo" className="w-14" /> 
          </div>
          <span className="text-lg md:text-xl font-bold text-slate-900 tracking-tight">EcoMoney</span>
        </Link>

        {/* CENTER: Desktop Navigation Links (Hidden on Mobile) */}
        <div className="hidden lg:flex items-center gap-2">
          <NavItem 
            href="/dashboard" 
            icon={<LayoutGrid size={18} />} 
            label="Dashboard" 
            active={isActive('/dashboard')} 
          />
          <NavItem 
            href="/transactions" 
            icon={<ReceiptText size={18} />} 
            label="Transactions" 
            active={isActive('/transactions')} 
          />
          <NavItem 
            href="/categories" 
            icon={<Settings size={18} />} 
            label="Categories" 
            active={isActive('/categories')} 
          />
        </div>

        {/* RIGHT SECTION: Profile + Actions */}
        <div className="flex items-center gap-3 md:gap-4">
          
          {/* 1. PROFILE ICON (Visible on ALL screens) */}
          {/* Sits before Logout (Desktop) and before Menu (Mobile) */}
          <Link href="/profile" className="relative group">
            <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-slate-100 border-2 border-white shadow-sm overflow-hidden transition-all hover:border-emerald-400 hover:shadow-md shrink-0">
              {/* Replace with your actual user image URL */}
              <img 
                src="https://i.pravatar.cc/150?img=32" 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            </div>
          </Link>

          {/* 2. DESKTOP LOGOUT (Hidden on Mobile) */}
          <div className="hidden lg:block">
            <button className="flex items-center gap-2 text-slate-400 hover:text-rose-500 transition-colors text-sm font-medium px-3 py-2">
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>

          {/* 3. MOBILE HAMBURGER (Visible only on Mobile) */}
          <button 
            className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            onClick={toggleMenu}
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

        </div>

      </div>

      {/* MOBILE MENU DROPDOWN (Visible only when Open) */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-16 left-0 w-full bg-white border-b border-slate-100 shadow-lg flex flex-col p-4 gap-2 animate-in slide-in-from-top-5">
          <NavItem 
            href="/dashboard" 
            icon={<LayoutGrid size={18} />} 
            label="Dashboard" 
            active={isActive('/dashboard')} 
            onClick={() => setIsMobileMenuOpen(false)} 
            className="w-full justify-start"
          />
          <NavItem 
            href="/transactions" 
            icon={<ReceiptText size={18} />} 
            label="Transactions" 
            active={isActive('/transactions')} 
            onClick={() => setIsMobileMenuOpen(false)}
            className="w-full justify-start"
          />
          <NavItem 
            href="/categories" 
            icon={<Settings size={18} />} 
            label="Categories" 
            active={isActive('/categories')} 
            onClick={() => setIsMobileMenuOpen(false)}
            className="w-full justify-start"
          />
          
          <div className="h-px bg-slate-100 my-2"></div>
          
          <button className="flex w-full items-center gap-2.5 px-5 py-3 rounded-xl text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-colors text-sm font-medium">
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      )}
    </nav>
  );
}

// --- SUB-COMPONENT (Reusable Link Item) ---

type NavItemProps = {
  href: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
  className?: string;
  onClick?: () => void; 
};

function NavItem({ 
  href, 
  icon, 
  label, 
  active, 
  className = '',
  onClick 
}: NavItemProps) {
  return (
    <Link 
      href={href} 
      onClick={onClick}
      className={`
        flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
        ${active 
          ? 'bg-slate-100 text-slate-900' 
          : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700' 
        }
        ${className}
      `}
    >
      {icon}
      {label}
    </Link>
  );
}