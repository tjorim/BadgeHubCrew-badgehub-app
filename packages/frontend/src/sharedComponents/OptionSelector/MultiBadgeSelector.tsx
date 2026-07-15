import { BADGE_SLUGS } from "@config.ts";
import type { BadgeSlug } from "@shared/domain/readModels/Badge.ts";
import { MultiOptionSelectorWithTitle } from "@sharedComponents/OptionSelector/MultiOptionSelectorWithTitle.tsx";
import type React from "react";

export const MultiBadgeSelector: React.FC<{
  badges: BadgeSlug[] | undefined;
  onBadgeChange: (selectedBadges: BadgeSlug[]) => void;
  noValueSetName: string;
}> = ({ badges, onBadgeChange, noValueSetName }) => {
  const valueMap = Object.fromEntries(BADGE_SLUGS.map((slug) => [slug, slug]));
  return (
    <MultiOptionSelectorWithTitle
      noValueSetName={noValueSetName}
      title="Badge"
      valueMap={valueMap}
      value={badges}
      onValueSelection={onBadgeChange}
    />
  );
};
