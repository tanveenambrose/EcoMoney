// app/categories/page.tsx

import React, { useState } from 'react';
import { Plus, Home, BarChart3, ShoppingCart, Laptop, Film, Bus, ShoppingBag, Zap, LucideIcon } from 'lucide-react';
import CategoryCard from '../../components/CategoryCard';
import RotatingBorderCard from '../categories/RotatingBorder';
import AddCategoryModal from '@/components/AddCategoryModal';
import VerifyPasswordModal from '@/components/VerifyPasswordModal';

// Define the type for a Category object
interface Category {
  name: string;
  icon: LucideIcon;
  colorClass: string;
  active: boolean;
}

// Sample data structure for the categories (UNCHANGED)
const categoriesData: Category[] = [
  { name: 'Salary', icon: BarChart3, colorClass: 'bg-green-600', active: true },
  { name: 'Rent', icon: Home, colorClass: 'bg-red-600', active: true },
  { name: 'Groceries', icon: ShoppingCart, colorClass: 'bg-blue-600', active: true },
  { name: 'Freelance', icon: Laptop, colorClass: 'bg-purple-600', active: true },
  { name: 'Entertainment', icon: Film, colorClass: 'bg-pink-600', active: true },
  { name: 'Transport', icon: Bus, colorClass: 'bg-yellow-600', active: true },
  { name: 'Shopping', icon: ShoppingBag, colorClass: 'bg-teal-600', active: true },
  { name: 'Bills', icon: Zap, colorClass: 'bg-orange-600', active: true },
];

// Define the type for the action the user intends to perform
type ActionType = 'EDIT' | 'DELETE' | null;

export default function CategoriesPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  // NEW STATE for Secure Action Flow
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
  const [categoryTarget, setCategoryTarget] = useState<string | null>(null); // The category name
  const [pendingAction, setPendingAction] = useState<ActionType>(null); // EDIT or DELETE

  // --- Modal Control Functions (UNCHANGED) ---

  const handleCloseVerifyModal = () => {
    setIsVerifyModalOpen(false);
    setCategoryTarget(null); // Clear the target category
    setPendingAction(null); // Clear the pending action
  };

  const handleDeleteClick = (categoryName: string) => {
    setCategoryTarget(categoryName);
    setPendingAction('DELETE');
    setIsVerifyModalOpen(true);
  };
  
  const handleEditClick = (categoryName: string) => {
    setCategoryTarget(categoryName);
    setPendingAction('EDIT');
    setIsVerifyModalOpen(true);
  };

  // --- Verification and Action Execution (UNCHANGED) ---

  const handleVerifyAndExecuteAction = (password: string) => {
    if (!categoryTarget || !pendingAction) return;

    console.log(`Verifying password for action: ${pendingAction} on category: ${categoryTarget}`);
    
    // **TODO: Call API to verify password**
    // Simulated Success/Failure logic:
    if (password === "1234") { // Replace "1234" with actual verification logic
      
      handleCloseVerifyModal(); // Close the verification modal immediately

      if (pendingAction === 'DELETE') {
        console.log(`Password verified. Deleting category: ${categoryTarget}`);
        // **TODO: Execute Delete API call logic**
      } else if (pendingAction === 'EDIT') {
        console.log(`Password verified. Opening EDIT modal for: ${categoryTarget}`);
        // **TODO: Implement logic to open the dedicated Edit Modal**
      }

    } else {
      // **TODO: Implement password failure feedback**
    }
  };

  // --- Add Category Handlers (UNCHANGED) ---
  const handleAddCategory = () => setIsAddModalOpen(true);
  const handleCloseAddModal = () => setIsAddModalOpen(false);
  
  const handleSaveCategory = (
    categoryName: string, 
    icon: string, 
    color: string, 
    iconType: 'emoji' | 'url'
  ) => {
    console.log(`New Category Saved: Name: ${categoryName}, Icon: ${icon}, Color: ${color}, Type: ${iconType}`);
    setIsAddModalOpen(false);
  };
  // ----------------------------------------


  return (
    // Responsive padding: p-4 for mobile, p-8 for large, max-w-7xl to prevent excessive stretching
    <div className="h-screen w-full bg-gray-900 text-white p-4 sm:p-6 md:p-10 mx-auto ">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 sm:mb-10 border-b border-gray-700 pb-4">
        <div>
          {/* Responsive Font Size for H1 */}
          <h1 className="text-4xl sm:text-5xl font-bold pb-1.5 bg-linear-to-r from-[rgb(78,255,3)] to-[hsl(242,100%,50%)] bg-clip-text text-transparent">
            Categories
          </h1>
          <p className="text-sm sm:text-base text-gray-400 mt-1">
            Manage your transaction categories
          </p>
        </div>
        
        {/* Responsive margin and padding for button */}
        <button 
          onClick={handleAddCategory}
          className="mt-4 sm:mt-0 flex items-center space-x-2 px-5 py-2.5 bg-emerald-500 rounded-lg hover:bg-emerald-600 transition-colors shadow-lg font-medium text-sm sm:text-base"
        >
          <Plus size={20} />
          <span>Add Category</span>
        </button>
      </header>

      {/* Categories Grid: Adjusted grid for small screens */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {categoriesData.map((category) => (
          <RotatingBorderCard key={category.name}>
            <CategoryCard 
              name={category.name} 
              IconComponent={category.icon} 
              colorClass={category.colorClass} 
              active={category.active}
              onEdit={handleEditClick}     
              onDelete={handleDeleteClick} 
            />
          </RotatingBorderCard>
        ))}
      </div>

      {/* Add Category Modal (UNCHANGED) */}
      <AddCategoryModal 
        isOpen={isAddModalOpen} 
        onClose={handleCloseAddModal} 
        onSave={handleSaveCategory}
      />
      
      {/* Verify Password Modal (UNCHANGED) */}
      <VerifyPasswordModal
        isOpen={isVerifyModalOpen}
        onClose={handleCloseVerifyModal}
        onVerify={handleVerifyAndExecuteAction}
        categoryName={categoryTarget}
      />
      
      {/* Placeholder for the help button (Bottom right) */}
      <button className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 w-10 h-10 bg-gray-700 rounded-full text-white flex items-center justify-center text-lg font-bold hover:bg-gray-600 transition-colors">
        ?
      </button>
    </div>
  );
}