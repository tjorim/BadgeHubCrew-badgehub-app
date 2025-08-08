import React from "react";
import type { AppCardProps } from "../types.ts";
import { MLink } from "@sharedComponents/MLink.tsx";
import { ERROR_ICON_URL, FALLBACK_ICON_URL } from "@config.ts";
import { DownloadIcon } from "@sharedComponents/AppsGrid/DownloadIcon.tsx";
import GitLink from "@sharedComponents/GitLink.tsx";

const AppCard: React.FC<
  AppCardProps & {
    git_url?: string; // Add git_url to props
  }
> = ({
  name,
  description,
  categories,
  published_at,
  revision,
  badges,
  slug,
  icon_map,
  editable,
  installs,
  git_url,
}) => {
  const icon = icon_map?.["64x64"];
  const iconSrc = icon ? icon.url : FALLBACK_ICON_URL;

  return (
    <div
      data-testid="AppCard"
      className="bg-gray-800 rounded-lg shadow-lg overflow-hidden card-hover-effect flex flex-col h-60"
    >
      <div className="p-5 flex flex-col flex-grow">
        {/* Header with icon, title, and Git link */}
        <div className="flex items-center mb-3">
          <div className="w-10 h-10 rounded-lg bg-gray-700 flex items-center justify-center mr-4 flex-shrink-0 overflow-hidden">
            <img
              src={iconSrc}
              alt={name || "App icon"}
              className="w-8 h-8 object-contain"
              loading="lazy"
              onError={(e) => {
                e.currentTarget.src = ERROR_ICON_URL;
              }}
            />
          </div>
          <div className="flex-grow flex items-center justify-between min-w-0">
            <MLink
              to={
                editable
                  ? `/page/project/${slug}/edit`
                  : `/page/project/${slug}`
              }
              className="min-w-0" // Prevents the link from pushing other elements
            >
              <h3 className="text-xl font-semibold text-emerald-400 hover:text-emerald-300 transition-colors truncate">
                {name}
              </h3>
            </MLink>
            <GitLink url={git_url} />
          </div>
        </div>

        {/* Description with line clamp */}
        <p className="text-sm text-slate-400 leading-relaxed line-clamp-2">
          {description}
        </p>

        {/* Tags section pushed to bottom */}
        <div className="mt-auto mb-3">
          {(() => {
            const MAX_VISIBLE_CATEGORIES = 1;
            const MAX_VISIBLE_BADGES = 1;
            
            const categoryTags = categories?.map((cat, index) => ({
              text: cat,
              type: "category",
              id: `category-${index}`,
            })) ?? [];
            
            const badgeTags = badges?.map((badge, index) => ({
              text: badge,
              type: "badge", 
              id: `badge-${index}`,
            })) ?? [];

            const visibleCategories = categoryTags.slice(0, MAX_VISIBLE_CATEGORIES);
            const visibleBadges = badgeTags.slice(0, MAX_VISIBLE_BADGES);
            const hiddenCategoryCount = Math.max(0, categoryTags.length - MAX_VISIBLE_CATEGORIES);
            const hiddenBadgeCount = Math.max(0, badgeTags.length - MAX_VISIBLE_BADGES);

            return (
              <>
                {/* Show visible categories */}
                {visibleCategories.map((tag) => (
                  <span
                    key={tag.id}
                    className="tag text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-full"
                  >
                    {tag.text}
                  </span>
                ))}
                
                {/* Show +X more categories */}
                {hiddenCategoryCount > 0 && (
                  <span
                    className="text-xs text-slate-500 font-medium cursor-help mr-2"
                    title={categoryTags
                      .slice(MAX_VISIBLE_CATEGORIES)
                      .map((tag) => tag.text)
                      .join(", ")}
                  >
                    +{hiddenCategoryCount}
                  </span>
                )}
                
                {/* Show visible badges */}
                {visibleBadges.map((tag) => (
                  <span
                    key={tag.id}
                    className="tag-mcu text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-full"
                  >
                    {tag.text}
                  </span>
                ))}
                
                {/* Show +X more badges */}
                {hiddenBadgeCount > 0 && (
                  <span
                    className="text-xs text-slate-500 font-medium cursor-help"
                    title={badgeTags
                      .slice(MAX_VISIBLE_BADGES)
                      .map((tag) => tag.text)
                      .join(", ")}
                  >
                    +{hiddenBadgeCount}
                  </span>
                )}
              </>
            );
          })()}
        </div>
      </div>

      {/* Footer with stats */}
      <div className="px-5 py-3 bg-gray-700 border-t border-gray-700 flex justify-between items-center">
        <p className="text-sm text-slate-400">Revision: {revision ?? "-"}</p>
        <p className="text-sm text-slate-400">
          Published:{" "}
          {published_at ? new Date(published_at).toLocaleDateString() : "-"}
        </p>
        {installs !== undefined && (
          <p className="text-sm text-slate-400 flex items-center">
            <DownloadIcon />
            <span className="ml-1">{installs}</span>
          </p>
        )}
      </div>
    </div>
  );
};

export default AppCard;
