"use client"
import React, { useState } from 'react';

interface Category {
  id: string;
  name: string;
  subcategories?: Category[];
}

interface CategoryItemProps {
  category: Category;
}

const CategoryItem: React.FC<CategoryItemProps> = ({ category }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="pl-4">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="flex items-center justify-between w-full px-2 py-1 hover:bg-gray-200">
          {category.name}
          {category.subcategories && category.subcategories.length > 0 && (
            <span>{isOpen ? '-' : '+'}</span>
          )}
      </button>
      {isOpen && category.subcategories && (
        <div className="ml-4">
          {category.subcategories.map(sub => (
            <CategoryItem key={sub.id} category={sub} />
          ))}
        </div>
      )}
    </div>
  );
}

export default CategoryItem;
