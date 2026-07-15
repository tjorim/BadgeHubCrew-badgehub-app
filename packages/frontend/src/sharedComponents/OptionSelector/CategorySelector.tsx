import {
  type CategoryName,
  getAllCategoryNames,
} from "@shared/domain/readModels/project/Category.ts";
import { OptionSelectorWithTitle } from "@sharedComponents/OptionSelector/OptionSelectorWithTitle.tsx";
import type React from "react";

export const CategorySelector: React.FC<{
  noValueSetName: string;
  category: CategoryName | undefined;
  onCategoryChange: (selectedCategory: CategoryName | undefined) => void;
}> = ({ category, onCategoryChange, noValueSetName }) => {
  const valueMap: Record<string, string> = Object.fromEntries(
    getAllCategoryNames().map((c) => [c, c])
  );
  return (
    <OptionSelectorWithTitle
      noValueSetName={noValueSetName}
      title="Category"
      valueMap={valueMap}
      value={category}
      onValueSelection={onCategoryChange}
    />
  );
};
