// components/AddCategoryModal.tsx

import React, { useState } from 'react';
import { X, Check } from 'lucide-react';

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, icon: string, color: string, iconType: 'emoji' | 'url') => void;
}

// 1. Define Color Options
const colorOptions: string[] = [
  'bg-green-500', 'bg-red-500', 'bg-blue-500', 
  'bg-orange-500', 'bg-yellow-500', 'bg-purple-500',
  'bg-pink-500', 'bg-teal-500', 
];

// 2. Define Sample Emojis
const emojiOptions: string[] = [
  '💼', '🏠', '🛒', '💻', '🎬', '🚗', '🛍️', '🎁', 
  '💡', '💊', '✈️', '🍕', '🎮', '💪' 
];

// Helper component for the Category Card Preview
const PreviewCard: React.FC<{ name: string, icon: string, color: string }> = ({ name, icon, color }) => (
  // Subtle glass background, defined border, and shadow
  <div className="p-2 rounded-xl shadow-lg bg-gray-700/50 backdrop-blur-sm border border-gray-600/30 flex items-center space-x-4"> 
    <div className={`p-2 rounded-xl ${color} text-xl shadow-md`}>
      {icon}
    </div>
    <span className="text-white text-lg font-semibold truncate"> {/* Added truncate for long names */}
      {name || 'Category Name'}
    </span>
  </div>
);

export default function AddCategoryModal({ isOpen, onClose, onSave }: AddCategoryModalProps) {
  // State for Form Inputs
  const [categoryName, setCategoryName] = useState('');
  const [iconType, setIconType] = useState<'emoji' | 'url'>('emoji');
  const [selectedIcon, setSelectedIcon] = useState(emojiOptions[0]);
  const [selectedColor, setSelectedColor] = useState('bg-green-500'); 
  const [imageURL, setImageURL] = useState(''); 

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (categoryName.trim()) {
      const finalIcon = iconType === 'emoji' ? selectedIcon : imageURL;
      onSave(categoryName, finalIcon, selectedColor, iconType);
      
      // Reset state after save
      setCategoryName('');
      setIconType('emoji');
      setSelectedIcon(emojiOptions[0]);
      setSelectedColor('bg-green-500'); 
      setImageURL('');
      onClose();
    }
  };

  return (
    // Backdrop overlay: CRITICAL FIX: Added overflow-y-auto and min-h-screen
    <div 
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xl flex items-start justify-center px-4 py-10 sm:px-6 lg:px-8 overflow-y-auto min-h-screen"
      onClick={onClose}
    >
      
      {/* Modal Container: Adjusted to use margin top/bottom and fit content */}
      <div 
        className="bg-gray-800/60 backdrop-blur-2xl border border-gray-500/30 rounded-3xl shadow-2xl shadow-black/70 w-full max-w-lg transition-all duration-300 transform p-8 my-auto" // CRITICAL FIX: Replaced my-auto for vertical centering with margin, but content takes priority
        onClick={e => e.stopPropagation()} 
      >
        <header className="flex justify-between items-center border-b border-gray-600/50 pb-4 mb-6">
          <h2 className="text-3xl font-bold text-white">Add Category</h2>
          <button onClick={onClose} className="text-gray-300 hover:text-white transition-colors">
            <X size={28} />
          </button>
        </header>

        <form onSubmit={handleSubmit}>
          
          {/* Category Name Input */}
          <div className="mb-6">
            <label htmlFor="name" className="block text-md font-medium text-gray-300 mb-2">
              Category Name
            </label>
            <input
              type="text"
              id="name"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="Enter category name"
              required
              className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600/70 rounded-xl text-white placeholder-gray-400 focus:ring-emerald-500 focus:border-emerald-500 outline-none shadow-inner transition-all"
            />
          </div>

          {/* Icon Type Toggle */}
          <div className="mb-6">
            <label className="block text-md font-medium text-gray-300 mb-2">
              Icon Type
            </label>
            <div className="flex bg-gray-900/50 p-1 rounded-xl border border-gray-600/70 shadow-inner">
              <button
                type="button"
                onClick={() => setIconType('emoji')}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  iconType === 'emoji' ? 'bg-emerald-500 text-white shadow-lg' : 'text-gray-400 hover:bg-gray-700/50'
                }`}
              >
                Emoji
              </button>
              <button
                type="button"
                onClick={() => setIconType('url')}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  iconType === 'url' ? 'bg-emerald-500 text-white shadow-lg' : 'text-gray-400 hover:bg-gray-700/50'
                }`}
              >
                Image URL
              </button>
            </div>
          </div>

          {/* Icon/Image Selection Area */}
          <div className="mb-6 p-4 rounded-xl bg-gray-900/50 backdrop-blur-md border border-gray-600/70 shadow-inner">
            {iconType === 'emoji' ? (
              // Emoji Selector
              <>
                <div className="grid grid-cols-6 sm:grid-cols-8 gap-3">
                  {emojiOptions.map((emoji, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setSelectedIcon(emoji)}
                      className={`text-3xl p-2 rounded-lg transition-colors hover:bg-gray-700/50 ${
                        selectedIcon === emoji ? 'ring-2 ring-emerald-500 bg-gray-700/70 shadow-md scale-105' : ''
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
                {/* See More Placeholder */}
                <button 
                  type="button" 
                  className="mt-4 w-full text-center text-emerald-400 hover:text-emerald-300 transition-colors text-sm font-medium"
                  onClick={() => alert('Feature: Load extensive emoji picker')}
                >
                  See More Emojis...
                </button>
              </>
            ) : (
              // Image URL Input
              <input
                type="url"
                value={imageURL}
                onChange={(e) => setImageURL(e.target.value)}
                placeholder="Paste Image URL (e.g., https://.../icon.png)"
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600/70 rounded-xl text-white placeholder-gray-400 focus:ring-emerald-500 focus:border-emerald-500 outline-none shadow-inner"
              />
            )}
          </div>

          {/* Color Selection */}
          <div className="mb-6">
            <label className="block text-md font-medium text-gray-300 mb-3">
              Color
            </label>
            <div className="flex flex-wrap gap-4">
              {colorOptions.map((color, index) => {
                const isSelected = color === selectedColor;
                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setSelectedColor(color)}
                    className={`w-9 h-9 rounded-full transition-all duration-200 border-2 border-transparent relative shadow-md ${color} ${
                      isSelected ? 'ring-4 ring-offset-2 ring-emerald-500 ring-offset-gray-800/70 scale-110' : 'hover:opacity-90'
                    }`}
                  >
                    {isSelected && (
                      <Check size={18} className="absolute inset-0 m-auto text-white drop-shadow-lg" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Live Preview */}
          <div className="mb-8">
            <label className="block text-md font-medium text-gray-300 mb-2">
              Preview
            </label>
            <PreviewCard 
              name={categoryName} 
              icon={iconType === 'emoji' ? selectedIcon : '🔗'}
              color={selectedColor} 
            />
          </div>


          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-4 border-t border-gray-600/50">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-600/70 rounded-lg text-gray-300 font-semibold hover:bg-gray-700/50 transition-colors shadow-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-emerald-500 rounded-lg text-white font-semibold hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/30"
            >
              Add Category
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}