// components/CategoryCard.tsx

import React, { useState } from 'react'; // <-- IMPORT useState
import { LucideIcon, Pencil, Trash2 } from 'lucide-react'; // <-- IMPORT Pencil and Trash2 icons

interface CategoryCardProps {
  name: string;
  IconComponent: LucideIcon;
  colorClass: string;
  active: boolean;
  // Optional: Add handlers for edit/delete actions if needed
  onEdit?: (categoryName: string) => void; 
  onDelete?: (categoryName: string) => void;
}

export default function CategoryCard({ 
  name, 
  IconComponent, 
  colorClass, 
  active,
  onEdit, // Destructure optional props
  onDelete
}: CategoryCardProps) {
  
  // State to track hover status
  const [isHovered, setIsHovered] = useState(false);

  const statusDotColor = active ? 'bg-green-500' : 'bg-red-500';
  
  let cardBgClass = colorClass.replace('200', '700'); 
  if (cardBgClass === colorClass) {
      cardBgClass = 'bg-gray-800';
  }

  const finalCardClasses = `${cardBgClass} transition-all duration-300 hover:ring-2 hover:ring-emerald-500`;

  return (
    // Add onMouseEnter and onMouseLeave to track hover state
    <div 
      className={`p-6 rounded-2xl shadow-xl cursor-pointer relative ${finalCardClasses}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-start justify-between">
        
        {/* Icon Area */}
        <div className={`p-4 rounded-xl mb-4 ${colorClass} bg-opacity-80 text-white`}>
          <IconComponent size={28} />
        </div>
        
        {/* The Active Status Dot (Top Right) - Stays visible */}
        <div className={`w-3 h-3 rounded-full ${statusDotColor}`} title={active ? 'Active' : 'Inactive'}></div>
      </div>

      {/* Edit and Delete Icons - Conditionally rendered based on isHovered */}
      {isHovered && (
        <div className="absolute top-4 right-4 flex space-x-2 transition-opacity duration-300">
          <button 
            onClick={(e) => { 
              e.stopPropagation(); // Prevent card click if it had one
              // eslint-disable-next-line @typescript-eslint/no-unused-expressions
              onEdit && onEdit(name); 
            }}
            className="p-2 rounded-full bg-gray-700/70 backdrop-blur-sm text-gray-300 hover:text-white hover:bg-emerald-500 transition-colors shadow-md"
            title="Edit Category"
          >
            <Pencil size={18} />
          </button>
          <button 
            onClick={(e) => { 
              e.stopPropagation(); // Prevent card click
              // eslint-disable-next-line @typescript-eslint/no-unused-expressions
              onDelete && onDelete(name); 
            }}
            className="p-2 rounded-full bg-gray-700/70 backdrop-blur-sm text-gray-300 hover:text-white hover:bg-red-500 transition-colors shadow-md"
            title="Delete Category"
          >
            <Trash2 size={18} />
          </button>
        </div>
      )}
     <h2 className="text-2xl font-semibold mt-2">{name}</h2>
      
      {/* The Active Status Text (Bottom Left) */}
      <p className="text-sm text-gray-400 mt-1 flex items-center">
        <span className={`inline-block w-2 h-2 rounded-full mr-2 ${statusDotColor}`}></span>
        {active ? 'Active' : 'Inactive'}
      </p>
     
    </div>
  );
}