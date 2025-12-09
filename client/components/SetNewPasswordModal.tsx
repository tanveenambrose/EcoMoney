'use client';

import React, { useState } from 'react';
import { X, Check, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import Button from './ui/button';

interface SetNewPasswordModalProps {
  open: boolean;
  onClose: () => void;
  // You might need to pass backendUrl and user token here if handling API call directly
  backendUrl?: string; 
  userId?: string;
}

const SetNewPasswordModal: React.FC<SetNewPasswordModalProps> = ({
  open,
  onClose,
  backendUrl,
  userId
}) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const resetForm = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setIsLoading(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  }

  const handleSubmit = async () => {
    // 1. Basic Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill in all fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }

    if (newPassword.length < 6) {
        toast.warn("Password should be at least 6 characters long.");
        // Keep going, but warn. Or return to stop.
    }

    setIsLoading(true);

    try {
        // --- API CALL SIMULATION ---
        // Replace this block with your actual API call to change the password.
        // You usually need to send { userId, currentPassword, newPassword }
        /*
        const response = await fetch(`${backendUrl}/api/user/change-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, currentPassword, newPassword }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Failed to change password");
        */

        // Simulate network request delay for demo purposes
        await new Promise(resolve => setTimeout(resolve, 1500));

        // If successful:
        toast.success("Password successfully changed!");
        handleClose();

    } catch (error: any) {
        toast.error(error.message || "An error occurred.");
    } finally {
        setIsLoading(false);
    }
  };

  // Reusable Input Style
  const inputClasses = "w-full mt-1 bg-slate-800 border border-slate-700 hover:border-slate-600 focus:border-indigo-500 px-4 py-3 rounded-xl outline-none transition-colors text-white font-medium placeholder:text-slate-500";
  const labelClasses = "text-xs font-bold text-slate-400 uppercase ml-1 tracking-wider";

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 font-sans">
          
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
            className="w-full max-w-md bg-slate-900 rounded-4xl shadow-2xl border border-white/10 relative z-10 overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-slate-800/50">
              <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-xl">
                    <Lock size={20} />
                  </div>
                  <h2 className="text-xl font-bold text-white tracking-tight">Change Password</h2>
              </div>
              <Button
                onClick={handleClose}
                className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition"
              >
                <X size={20} />
              </Button>
            </div>

            <div className="p-6 space-y-6">
              
              {/* Current Password */}
              <div>
                <label className={labelClasses}>Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className={inputClasses}
                  placeholder="Enter current password"
                  autoFocus
                />
              </div>

              {/* New Password */}
              <div>
                <label className={labelClasses}>New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className={inputClasses}
                  placeholder="Enter new password"
                />
              </div>

              {/* Confirm New Password */}
              <div>
                <label className={labelClasses}>Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={` ${inputClasses} ${confirmPassword && newPassword !== confirmPassword ? 'border-rose-500 focus:border-rose-500' : ''}`}
                  placeholder="Retype new password"
                />
                {confirmPassword && newPassword !== confirmPassword && (
                    <p className="text-rose-500 text-xs mt-1 ml-1 font-medium">Passwords do not match</p>
                )}
              </div>


              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleClose}
                  disabled={isLoading}
                  className="flex-1 py-3.5 rounded-xl font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="flex-1 py-3.5 rounded-xl font-bold text-white transition-all shadow-lg flex items-center justify-center gap-2 bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-indigo-900/30 disabled:opacity-70"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Updating...
                    </span>
                  ) : (
                    <>
                        <Check size={20} strokeWidth={3} />
                        Update Password
                    </>
                  )}
                </button>
              </div>

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SetNewPasswordModal;