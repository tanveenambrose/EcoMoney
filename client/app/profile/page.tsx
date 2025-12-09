'use client';

import React, { useState, useContext, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit2, Lock, Camera, Check, Sparkles, User, Smartphone, Mail } from 'lucide-react';
import { AppContext } from '@/context/AppContext';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
// Import the new modal component
import SetNewPasswordModal from '@/components/SetNewPasswordModal';

// --- Reusable Editable Component (Unchanged for Name/Phone) ---
interface EditableFieldProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  onSave: (newValue: string) => void;
  // Removed password-specific props as they are no longer needed here
}

const EditableField: React.FC<EditableFieldProps> = ({ 
  label, 
  value, 
  icon, 
  onSave, 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value);

  useEffect(() => { 
    setInputValue(value); 
  }, [value]);

  const handleEditClick = () => { 
    setInputValue(value); 
    setIsEditing(true); 
  };

  const handleDoneClick = () => { 
      onSave(inputValue); 
      setIsEditing(false); 
    };

  return (
    <motion.div layout className={`group relative flex items-center justify-between p-3 md:p-4 rounded-2xl transition-all duration-300 ${isEditing ? 'bg-white shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-indigo-100' : 'hover:bg-white/50 border border-transparent'}`}>
      <div className="flex-1 mr-3 md:mr-4 flex items-center gap-3 md:gap-4">
        <div className={`p-2.5 md:p-3 rounded-xl transition-colors duration-300 ${isEditing ? 'bg-indigo-600 text-white' : 'bg-indigo-50 text-indigo-500'}`}>{icon}</div>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5 md:mb-1">{label}</p>
          <div className="relative h-7 md:h-8 flex items-center">
            {isEditing ? (
              <div className="relative w-full">
                <motion.input 
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  exit={{ opacity: 0, y: -10 }} 
                  type="text"
                  value={inputValue} 
                  onChange={(e) => setInputValue(e.target.value)} 
                  className="w-full text-base md:text-lg font-bold text-slate-800 bg-transparent focus:outline-none pb-1" 
                  autoFocus
                />
                <motion.div layoutId="underline" className="absolute bottom-0 left-0 h-0.5 w-full bg-linear-to-r from-indigo-500 to-purple-500" />
              </div>
            ) : (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-base md:text-lg font-bold text-slate-700 truncate">{value}</motion.p>
            )}
          </div>
        </div>
      </div>
      <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={isEditing ? handleDoneClick : handleEditClick} className={`relative flex items-center justify-center gap-2 px-3 py-1.5 md:px-4 md:py-2 text-[10px] md:text-xs font-bold uppercase tracking-wide rounded-xl transition-all shadow-md overflow-hidden shrink-0 ${isEditing ? 'text-white bg-linear-to-r from-emerald-400 to-emerald-600 shadow-emerald-200' : 'text-indigo-600 bg-white border border-indigo-100 shadow-indigo-100 group-hover:border-indigo-200'}`}>
        <AnimatePresence mode='wait'>
          {isEditing ? (
            <motion.div key="done" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }} className="flex items-center gap-1"><Check size={14} strokeWidth={3} /> <span className="hidden sm:inline">Done</span></motion.div>
          ) : (
            <motion.div key="edit" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }} className="flex items-center gap-1"><Edit2 size={14} /> <span className="hidden sm:inline">Edit</span></motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </motion.div>
  );
};

// --- Main Profile Component ---
const ProfileSettings = () => {
  const { userData, backendUrl, getUserData } = useContext(AppContext) as any;
  const router = useRouter();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  
  // State to control the new password modal
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch Data on Load
  useEffect(() => {
    if (getUserData) getUserData();
  }, []);

  // Sync State
  useEffect(() => {
    if (userData) {
      setName(userData.name || '');
      setPhone(userData.phoneNo || '');
      setEmail(userData.email || '');
      setImage(userData.image || '');
    }
  }, [userData]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImage(URL.createObjectURL(file));
    }
  };

  const handleSaveToBackend = async () => {
    try {
      const formData = new FormData();
      if(!userData?.userId) {
          toast.error("User ID not found. Try logging in again.");
          return;
      }

      formData.append('userId', userData.userId);
      formData.append('name', name);
      formData.append('phoneNo', phone);
      // Password is no longer handled here
      
      if (imageFile) formData.append('image', imageFile);

      const response = await fetch(`${backendUrl}/api/user/update-profile`, {
        method: 'PUT',
        credentials: 'include',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Profile Updated!");
        if (getUserData) await getUserData();
        setTimeout(() => router.push('/dashboard'), 500);
      } else {
        toast.error(data.message || "Update failed");
      }
    } catch (error) {
      toast.error("Error updating profile");
    }
  };

  return (
    <div className="min-h-screen bg-[#103b67] flex items-center justify-center p-4 md:p-8 font-sans">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[24px  24px]"></div>
      <div className="absolute inset-0 bg-linear-to-tr from-indigo-100 via-transparent to-cyan-100 opacity-60"></div>

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, type: "spring" }} className="relative w-full max-w-3xl bg-white/70 backdrop-blur-2xl rounded-3xl md:rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-white/50 overflow-hidden z-10">
        <div className="absolute top-0 w-full h-1.5 md:h-2 bg-linear-to-r from-indigo-500 via-purple-500 to-cyan-500"></div>

        <div className="relative p-6 md:p-12 flex flex-col md:flex-row gap-8 md:gap-12">
          
          {/* Photo Section */}
          <div className="flex flex-col items-center md:w-1/3 border-b border-indigo-50 pb-8 md:border-b-0 md:border-r md:pb-0 md:pr-8">
            <motion.div className="relative mb-4 md:mb-6 group" whileHover={{ scale: 1.02 }}>
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full p-1 bg-linear-to-br from-indigo-500 via-purple-500 to-cyan-500 shadow-xl">
                <div className="w-full h-full rounded-full overflow-hidden border-4 border-white relative bg-white">
                  <img
                    src={image ? `${image}` : "https://placehold.co/400x400?text=User"}
                    alt="Profile"
                    className="w-full h-full object-cover"
                    crossOrigin="anonymous"
                  />
                </div>
              </div>
              <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" hidden />
              <motion.button onClick={() => fileInputRef.current?.click()} whileHover={{ scale: 1.1, rotate: 15 }} whileTap={{ scale: 0.9 }} className="absolute bottom-1 right-1 md:bottom-2 md:right-2 bg-white text-indigo-600 p-2 md:p-3 rounded-full shadow-[0_4px_15px_rgba(0,0,0,0.15)] border border-indigo-50 hover:text-purple-600 transition-colors cursor-pointer">
                <Camera size={16} className="md:w-[18px] md:h-[18px]" />
              </motion.button>
            </motion.div>
            <h2 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight text-center">{name || 'User'}</h2>
            <div className="flex items-center gap-1 text-slate-400 text-xs md:text-sm mt-1 font-medium bg-slate-100 px-3 py-1 rounded-full"><Sparkles size={12} className="text-amber-400" /> Premium Member</div>
          </div>

          {/* Form Section */}
          <div className="flex-1 space-y-5 md:space-y-6">
            <div className="flex items-center justify-between mb-2 md:mb-4">
              <h3 className="text-lg md:text-xl font-bold text-slate-800">Account Details</h3>
              <span className="text-[10px] md:text-xs font-semibold text-slate-400 bg-white border border-slate-200 px-2 py-1 rounded-md shadow-sm">Editable</span>
            </div>

            <div className="space-y-3 md:space-y-4">
              <EditableField label="Full Name" value={name} icon={<User size={18} className="md:w-5 md:h-5" />} onSave={setName} />
              <EditableField label="Phone Number" value={phone} icon={<Smartphone size={18} className="md:w-5 md:h-5" />} onSave={setPhone} />
              
              {/* MODIFIED Password Field - Triggers Modal instead of inline edit */}
              <div className="group relative flex items-center justify-between p-3 md:p-4 rounded-2xl transition-all duration-300 hover:bg-white/50 border border-transparent">
                <div className="flex-1 mr-3 md:mr-4 flex items-center gap-3 md:gap-4">
                    <div className="p-2.5 md:p-3 rounded-xl transition-colors duration-300 bg-indigo-50 text-indigo-500">
                        <Lock size={18} className="md:w-5 md:h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                    <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5 md:mb-1">Password</p>
                    <div className="relative h-7 md:h-8 flex items-center">
                        <p className="text-base md:text-lg font-bold text-slate-700 truncate">••••••••••••</p>
                    </div>
                    </div>
                </div>
                <motion.button 
                    whileHover={{ scale: 1.05 }} 
                    whileTap={{ scale: 0.95 }} 
                    onClick={() => setIsPasswordModalOpen(true)} // Open Modal on click
                    className="relative flex items-center justify-center gap-2 px-3 py-1.5 md:px-4 md:py-2 text-[10px] md:text-xs font-bold uppercase tracking-wide rounded-xl transition-all shadow-md overflow-hidden shrink-0 text-indigo-600 bg-white border border-indigo-100 shadow-indigo-100 group-hover:border-indigo-200"
                >
                    <Edit2 size={14} /> <span className="hidden sm:inline">Change</span>
                </motion.button>
             </div>

              <div className="group flex items-center justify-between p-3 md:p-4 rounded-2xl bg-slate-50 border border-slate-100 opacity-80 select-none">
                <div className="flex-1 mr-4 flex items-center gap-3 md:gap-4">
                  <div className="p-2.5 md:p-3 rounded-xl bg-slate-200 text-slate-400"><Mail size={18} className="md:w-5 md:h-5" /></div>
                  <div className="min-w-0"><p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5 md:mb-1">Email Address</p><p className="text-base md:text-lg font-bold text-slate-500 font-mono tracking-tight truncate">{email}</p></div>
                </div>
                <div className="p-2 bg-slate-200 rounded-lg text-slate-400 shrink-0" title="ReadOnly"><Mail size={16} /></div>
              </div>
            </div>

            <div className="pt-6 md:pt-8 flex flex-col-reverse sm:flex-row items-center justify-end gap-6 sm:gap-4">
              <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                <motion.button onClick={() => router.push('/dashboard')} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto px-6 py-3 text-sm font-bold text-slate-500 bg-white border border-slate-200 rounded-xl shadow-sm hover:bg-slate-50 transition-all">Cancel</motion.button>
                <motion.button onClick={handleSaveToBackend} whileHover={{ scale: 1.02, boxShadow: "0 10px 25px -5px rgba(79, 70, 229, 0.4)" }} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto px-8 py-3 text-sm font-bold text-white bg-linear-to-r from-indigo-600 to-purple-600 rounded-xl shadow-lg hover:shadow-xl transition-all">Save Changes</motion.button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Render the Password Modal outside the main card flow */}
      <SetNewPasswordModal 
        open={isPasswordModalOpen} 
        onClose={() => setIsPasswordModalOpen(false)}
        backendUrl={backendUrl}
        userId={userData?.userId}
      />

    </div>
  );
};

export default ProfileSettings;