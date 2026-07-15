import { BADGE_SLUGS } from "@config.ts";
import type { BadgeSlug } from "@shared/domain/readModels/Badge.ts";
import { OptionSelectorWithTitle } from "@sharedComponents/OptionSelector/OptionSelectorWithTitle.tsx";
import type React from "react";

export const BadgeSelector: React.FC<{
  badge: BadgeSlug | undefined;
  onBadgeChange: (selectedBadge: BadgeSlug | undefined) => void;
  noValueSetName: string;
}> = ({ badge, onBadgeChange, noValueSetName }) => {
  const badges = BADGE_SLUGS;
  const valueMap = Object.fromEntries(badges.map((slug) => [slug, slug]));
  return (
    <OptionSelectorWithTitle
      noValueSetName={noValueSetName}
      title="Badge"
      valueMap={valueMap}
      value={badge}
      onValueSelection={onBadgeChange}
    />
  );
};
