import React from "react";

const MAX_VISIBLE_TAGS_PER_GROUP = 1;

const TagGroup: React.FC<{
  label: string;
  singularLabel: string;
  tags: readonly string[];
  badgeClassName: string;
}> = ({ label, singularLabel, tags, badgeClassName }) => {
  if (tags.length === 0) return null;

  const visibleTags = tags.slice(0, MAX_VISIBLE_TAGS_PER_GROUP);
  const hiddenTags = tags.slice(MAX_VISIBLE_TAGS_PER_GROUP);
  const hiddenLabel = hiddenTags.join(", ");

  return (
    <div
      role="group"
      aria-label={label}
      className="flex min-w-0 flex-1 items-center gap-1.5"
    >
      {visibleTags.map((tag, index) => (
        <span
          key={`${tag}-${index}`}
          className={`${badgeClassName} min-w-0 text-xs font-semibold`}
          title={tag}
        >
          <span className="truncate">{tag}</span>
        </span>
      ))}
      {hiddenTags.length > 0 && (
        <span
          className="shrink-0 cursor-help text-xs font-medium opacity-60"
          aria-label={`${hiddenTags.length} more ${
            hiddenTags.length === 1 ? singularLabel : label.toLowerCase()
          }: ${hiddenLabel}`}
          title={`More ${label.toLowerCase()}: ${hiddenLabel}`}
        >
          +{hiddenTags.length}
        </span>
      )}
    </div>
  );
};

const AppCardTags: React.FC<{
  categories: readonly string[] | null | undefined;
  badges: readonly string[] | null | undefined;
}> = ({ categories, badges }) => {
  const safeCategories = categories ?? [];
  const safeBadges = badges ?? [];

  return (
    <div className="mt-auto mb-3 flex w-full min-w-0 items-center gap-2">
      <TagGroup
        label="Categories"
        singularLabel="category"
        tags={safeCategories}
        badgeClassName="badge badge-neutral"
      />
      <TagGroup
        label="Badges"
        singularLabel="badge"
        tags={safeBadges}
        badgeClassName="badge badge-success"
      />
    </div>
  );
};

export default AppCardTags;
