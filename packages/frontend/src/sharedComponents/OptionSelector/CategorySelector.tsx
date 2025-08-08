import React, { useState } from "react";
import { OptionSelectorWithTitle } from "@sharedComponents/OptionSelector/OptionSelectorWithTitle.tsx";
import {
  CategoryName,
  getAllCategoryNames,
} from "@shared/domain/readModels/project/Category.ts";

// Single-select props
interface SingleSelectProps {
  multiSelect?: false;
  category: CategoryName | undefined;
  onCategoryChange: (selectedCategory: CategoryName | undefined) => void;
  noValueSetName: string;
}

// Multi-select props
interface MultiSelectProps {
  multiSelect: true;
  categories: CategoryName[];
  onCategoriesChange: (selectedCategories: CategoryName[]) => void;
  noValueSetName: string;
  compact?: boolean; // For filter vs edit page styling
}

type CategorySelectorProps = SingleSelectProps | MultiSelectProps;

export const CategorySelector: React.FC<CategorySelectorProps> = (props) => {
  const availableCategories = getAllCategoryNames();

  // Single-select mode (existing behavior)
  if (!props.multiSelect) {
    const valueMap: Record<string, string> = Object.fromEntries(
      availableCategories.map((c) => [c, c])
    );
    return (
      <OptionSelectorWithTitle
        noValueSetName={props.noValueSetName}
        title="Category"
        valueMap={valueMap}
        value={props.category}
        onValueSelection={props.onCategoryChange}
      />
    );
  }

  // Multi-select mode
  return <MultiSelectCategories {...props} availableCategories={availableCategories} />;
};

// Multi-select component
const MultiSelectCategories: React.FC<MultiSelectProps & { availableCategories: CategoryName[] }> = ({
  categories,
  onCategoriesChange,
  noValueSetName,
  compact = false,
  availableCategories
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggleCategory = (categoryName: CategoryName) => {
    const isSelected = categories.includes(categoryName);
    if (isSelected) {
      onCategoriesChange(categories.filter(c => c !== categoryName));
    } else {
      onCategoriesChange([...categories, categoryName]);
    }
  };

  const selectAllCategories = () => {
    onCategoriesChange([...availableCategories]);
  };

  const clearAllCategories = () => {
    onCategoriesChange([]);
  };

  if (!availableCategories.length) {
    return (
      <div>
        <div className="text-sm font-medium text-slate-300 mb-2">Category</div>
        <div className="w-full form-input p-2 text-slate-500 italic">
          No categories configured
        </div>
      </div>
    );
  }

  if (compact) {
    // Compact dropdown style for filters
    const getDisplayText = () => {
      if (categories.length === 0) {
        return "All Categories";
      } else if (categories.length === availableCategories.length) {
        return "All Categories";
      } else if (categories.length === 1) {
        return categories[0];
      } else {
        return `${categories.length} categories`;
      }
    };

    return (
      <div className="relative">
        <label className="block text-sm font-medium text-slate-300 mb-1">
          Category
        </label>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-left text-sm focus:ring-emerald-500 focus:border-emerald-500 flex justify-between items-center text-slate-200 hover:bg-gray-600"
        >
          <span className="truncate">{getDisplayText()}</span>
          <svg 
            className={`w-4 h-4 transform transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-gray-800 border border-gray-600 rounded-md shadow-lg">
            <div className="p-2 border-b border-gray-600 flex gap-1">
              <button
                type="button"
                onClick={selectAllCategories}
                className="text-xs px-2 py-1 bg-emerald-600 text-white rounded hover:bg-emerald-700"
              >
                All
              </button>
              <button
                type="button"
                onClick={clearAllCategories}
                className="text-xs px-2 py-1 bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                None
              </button>
            </div>
            <div className="max-h-48 overflow-y-auto">
              {availableCategories.map((categoryName) => (
                <label
                  key={categoryName}
                  className="flex items-center space-x-2 p-2 hover:bg-gray-700 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={categories.includes(categoryName)}
                    onChange={() => handleToggleCategory(categoryName)}
                    className="rounded border-gray-500 bg-gray-700 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="text-sm text-slate-200">{categoryName}</span>
                </label>
              ))}
            </div>
          </div>
        )}
        
        {isOpen && (
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
        )}
      </div>
    );
  }

  // Full expanded style for edit pages
  return (
    <div>
      <div className="text-sm font-medium text-slate-300 mb-2">Category</div>
      <div className="border border-gray-600 rounded-md p-3 bg-gray-800">
        <div className="mb-2 flex gap-2">
          <button
            type="button"
            onClick={selectAllCategories}
            className="text-xs px-2 py-1 bg-emerald-600 text-white rounded hover:bg-emerald-700"
          >
            Select All
          </button>
          <button
            type="button"
            onClick={clearAllCategories}
            className="text-xs px-2 py-1 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Clear All
          </button>
        </div>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {availableCategories.length === 0 ? (
            <div className="text-slate-500 text-sm italic">{noValueSetName}</div>
          ) : (
            availableCategories.map((categoryName) => (
              <label
                key={categoryName}
                className="flex items-center space-x-2 cursor-pointer hover:bg-gray-700 p-1 rounded"
              >
                <input
                  type="checkbox"
                  checked={categories.includes(categoryName)}
                  onChange={() => handleToggleCategory(categoryName)}
                  className="rounded border-gray-500 bg-gray-700 text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-sm text-slate-200">{categoryName}</span>
              </label>
            ))
          )}
        </div>
        {categories.length > 0 && (
          <div className="mt-2 pt-2 border-t border-gray-600">
            <div className="text-xs text-slate-400">
              Selected: {categories.join(", ")}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
