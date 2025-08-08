import React, { useState } from "react";
import { BadgeSlug } from "@shared/domain/readModels/Badge.ts";
import { OptionSelectorWithTitle } from "@sharedComponents/OptionSelector/OptionSelectorWithTitle.tsx";
import { BADGE_SLUGS } from "@config.ts";

// Single-select props
interface SingleSelectProps {
  multiSelect?: false;
  badge: BadgeSlug | undefined;
  onBadgeChange: (selectedBadge: BadgeSlug | undefined) => void;
  noValueSetName: string;
}

// Multi-select props  
interface MultiSelectProps {
  multiSelect: true;
  badges: BadgeSlug[];
  onBadgesChange: (selectedBadges: BadgeSlug[]) => void;
  noValueSetName: string;
  compact?: boolean; // For filter vs edit page styling
}

type BadgeSelectorProps = SingleSelectProps | MultiSelectProps;

export const BadgeSelector: React.FC<BadgeSelectorProps> = (props) => {
  const availableBadges = BADGE_SLUGS || [];

  // Single-select mode (existing behavior)
  if (!props.multiSelect) {
    const valueMap = Object.fromEntries(availableBadges.map((slug) => [slug, slug]));
    return (
      <OptionSelectorWithTitle
        noValueSetName={props.noValueSetName}
        title="Badge"
        valueMap={valueMap}
        value={props.badge}
        onValueSelection={props.onBadgeChange}
      />
    );
  }

  // Multi-select mode
  return <MultiSelectBadges {...props} availableBadges={availableBadges} />;
};

// Multi-select component
const MultiSelectBadges: React.FC<MultiSelectProps & { availableBadges: BadgeSlug[] }> = ({
  badges,
  onBadgesChange,
  noValueSetName,
  compact = false,
  availableBadges
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggleBadge = (badgeSlug: BadgeSlug) => {
    const isSelected = badges.includes(badgeSlug);
    if (isSelected) {
      onBadgesChange(badges.filter(b => b !== badgeSlug));
    } else {
      onBadgesChange([...badges, badgeSlug]);
    }
  };

  const clearAllBadges = () => {
    onBadgesChange([]);
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

  if (compact) {
    // Compact dropdown style for filters
    const getDisplayText = () => {
      if (badges.length === 0) {
        return "All Badges";
      } else if (badges.length === availableBadges.length) {
        return "All Badges";
      } else if (badges.length === 1) {
        return badges[0];
      } else {
        return `${badges.length} badges`;
      }
    };

    return (
      <div className="relative">
        <label className="block text-sm font-medium text-slate-300 mb-1">
          Badge
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
            <div className="p-2 border-b border-gray-600">
              <button
                type="button"
                onClick={clearAllBadges}
                className="text-xs px-2 py-1 bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                Clear
              </button>
            </div>
            <div className="max-h-48 overflow-y-auto">
              {availableBadges.map((badgeSlug) => (
                <label
                  key={badgeSlug}
                  className="flex items-center space-x-2 p-2 hover:bg-gray-700 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={badges.includes(badgeSlug)}
                    onChange={() => handleToggleBadge(badgeSlug)}
                    className="rounded border-gray-500 bg-gray-700 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="text-sm text-slate-200">{badgeSlug}</span>
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
      <div className="text-sm font-medium text-slate-300 mb-2">Badge</div>
      <div className="border border-gray-600 rounded-md p-3 bg-gray-800">
        <div className="mb-2">
          <button
            type="button"
            onClick={clearAllBadges}
            className="text-xs px-2 py-1 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Clear
          </button>
        </div>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {availableBadges.length === 0 ? (
            <div className="text-slate-500 text-sm italic">{noValueSetName}</div>
          ) : (
            availableBadges.map((badgeSlug) => (
              <label
                key={badgeSlug}
                className="flex items-center space-x-2 cursor-pointer hover:bg-gray-700 p-1 rounded"
              >
                <input
                  type="checkbox"
                  checked={badges.includes(badgeSlug)}
                  onChange={() => handleToggleBadge(badgeSlug)}
                  className="rounded border-gray-500 bg-gray-700 text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-sm text-slate-200">{badgeSlug}</span>
              </label>
            ))
          )}
        </div>
        {badges.length > 0 && (
          <div className="mt-2 pt-2 border-t border-gray-600">
            <div className="text-xs text-slate-400">
              Selected: {badges.join(", ")}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
