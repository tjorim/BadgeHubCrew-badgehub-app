import React from "react";
import { BadgeSlug } from "@shared/domain/readModels/Badge.ts";
import { BADGE_SLUGS } from "@config.ts";

export const MultiSelectBadgeSelector: React.FC<{
  badges: BadgeSlug[] | undefined;
  onBadgesChange: (selectedBadges: BadgeSlug[] | undefined) => void;
  noValueSetName: string;
}> = ({ badges, onBadgesChange, noValueSetName }) => {
  const availableBadges = BADGE_SLUGS || [];
  const selectedBadges = badges || [];

  const handleToggleBadge = (badgeSlug: BadgeSlug) => {
    const isSelected = selectedBadges.includes(badgeSlug);
    let newSelection: BadgeSlug[];
    
    if (isSelected) {
      newSelection = selectedBadges.filter(b => b !== badgeSlug);
    } else {
      newSelection = [...selectedBadges, badgeSlug];
    }
    
    onBadgesChange(newSelection.length === 0 ? undefined : newSelection);
  };

  const selectAllBadges = () => {
    onBadgesChange([...availableBadges]);
  };

  const clearAllBadges = () => {
    onBadgesChange(undefined);
  };

  if (!availableBadges.length) {
    return (
      <div>
        <div className="text-sm font-medium text-slate-300 mb-2">Badge</div>
        <div className="w-full form-input p-2 text-slate-500 italic">
          No badges configured
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="text-sm font-medium text-slate-300 mb-2">Badge</div>
      <div className="border border-gray-600 rounded-md p-3 bg-white">
        <div className="mb-2 flex gap-2">
          <button
            type="button"
            onClick={selectAllBadges}
            className="text-xs px-2 py-1 bg-emerald-600 text-white rounded hover:bg-emerald-700"
          >
            Select All
          </button>
          <button
            type="button"
            onClick={clearAllBadges}
            className="text-xs px-2 py-1 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Clear All
          </button>
        </div>
        <div className="space-y-2">
          {availableBadges.length === 0 ? (
            <div className="text-slate-500 text-sm italic">{noValueSetName}</div>
          ) : (
            availableBadges.map((badgeSlug) => (
              <label
                key={badgeSlug}
                className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-1 rounded"
              >
                <input
                  type="checkbox"
                  checked={selectedBadges.includes(badgeSlug)}
                  onChange={() => handleToggleBadge(badgeSlug)}
                  className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-sm text-gray-700">{badgeSlug}</span>
              </label>
            ))
          )}
        </div>
        {selectedBadges.length > 0 && (
          <div className="mt-2 pt-2 border-t border-gray-200">
            <div className="text-xs text-gray-600">
              Selected: {selectedBadges.join(", ")}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};