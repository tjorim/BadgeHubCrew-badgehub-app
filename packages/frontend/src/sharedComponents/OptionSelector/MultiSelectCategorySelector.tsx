import React from "react";
import {
  CategoryName,
  getAllCategoryNames,
} from "@shared/domain/readModels/project/Category.ts";

export const MultiSelectCategorySelector: React.FC<{
  categories: CategoryName[] | undefined;
  onCategoriesChange: (selectedCategories: CategoryName[] | undefined) => void;
  noValueSetName: string;
}> = ({ categories, onCategoriesChange, noValueSetName }) => {
  const availableCategories = getAllCategoryNames();
  const selectedCategories = categories || [];

  const handleToggleCategory = (categoryName: CategoryName) => {
    const isSelected = selectedCategories.includes(categoryName);
    let newSelection: CategoryName[];
    
    if (isSelected) {
      newSelection = selectedCategories.filter(c => c !== categoryName);
    } else {
      newSelection = [...selectedCategories, categoryName];
    }
    
    onCategoriesChange(newSelection.length === 0 ? undefined : newSelection);
  };

  const selectAllCategories = () => {
    onCategoriesChange([...availableCategories]);
  };

  const clearAllCategories = () => {
    onCategoriesChange(undefined);
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

  return (
    <div>
      <div className="text-sm font-medium text-slate-300 mb-2">Category</div>
      <div className="border border-gray-600 rounded-md p-3 bg-white">
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
                className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-1 rounded"
              >
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(categoryName)}
                  onChange={() => handleToggleCategory(categoryName)}
                  className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-sm text-gray-700">{categoryName}</span>
              </label>
            ))
          )}
        </div>
        {selectedCategories.length > 0 && (
          <div className="mt-2 pt-2 border-t border-gray-200">
            <div className="text-xs text-gray-600">
              Selected: {selectedCategories.join(", ")}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};