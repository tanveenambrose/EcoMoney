

import React, { useState } from 'react';
import { X, Lock } from 'lucide-react';

interface VerifyPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerify: (password: string) => void;
  categoryName: string | null; // The name of the category being deleted
}

export default function VerifyPasswordModal({ 
  isOpen, 
  onClose, 
  onVerify, 
  categoryName 
}: VerifyPasswordModalProps) {
  
  const [password, setPassword] = useState('');

  if (!isOpen || !categoryName) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.trim()) {
      onVerify(password);
      setPassword(''); // Clear password field
    }
  };

  return (
    // Backdrop overlay: Glass effect
    <div 
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xl flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      
      {/* Modal Container: Enhanced glass effect  */}
      <div 
        className="bg-gray-800/60 backdrop-blur-2xl border border-gray-500/30 rounded-3xl shadow-2xl shadow-black/70 w-full max-w-sm transition-all duration-300 transform p-6 sm:p-8"
        onClick={e => e.stopPropagation()} 
      >
        <header className="flex justify-between items-center pb-4 mb-4">
          <div className="flex items-center space-x-3 text-red-500">
            <Lock size={28} className="text-pink-500 drop-shadow-lg" />
            <h2 className="text-xl font-bold text-white">Verify Password</h2>
          </div>
          <button onClick={onClose} className="text-gray-300 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </header>

        <form onSubmit={handleSubmit}>
          
          <p className="text-gray-400 mb-4 text-sm">
            Please enter your password to delete the category: 
            <span className="font-semibold text-white ml-1"> {categoryName}</span>
          </p>

          {/* Password Input */}
          <div className="mb-8">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              className="w-full px-4 py-3 bg-gray-900/50 border border-red-500/70 rounded-xl text-white placeholder-gray-400 focus:ring-red-500 focus:border-red-500 outline-none shadow-inner transition-all"
            />
          </div>
          
          {/* Action Buttons */}
          <div className="flex justify-between space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-600/70 rounded-lg text-gray-300 font-semibold hover:bg-gray-700/50 transition-colors shadow-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-pink-500 rounded-lg text-white font-semibold hover:bg-pink-600 transition-colors shadow-lg shadow-pink-500/30"
            >
              Verify
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}