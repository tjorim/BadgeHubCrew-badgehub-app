import type { ProjectDetails } from "@shared/domain/readModels/project/ProjectDetails.ts";
import type React from "react";

const AppSidebarAuthor: React.FC<{ project: ProjectDetails }> = ({
  project,
}) => {
  // Author is not yet on ProjectDetails; stub until the model includes it.
  const author =
    "author" in project && project.author && typeof project.author === "object"
      ? (project.author as {
          avatarUrl?: string;
          displayName?: string;
          username?: string;
          createdAt?: string;
          bio?: string;
        })
      : {};
  return (
    <section className="card bg-base-200 shadow-lg todoElement">
      <div className="card-body p-6">
        <h2 className="text-xl font-semibold mb-4 border-b border-base-300 pb-2">
          Author
        </h2>
        <div className="flex items-center">
          <img
            src={
              author.avatarUrl ||
              "https://placehold.co/50x50/047857/D1FAE5?text=DG"
            }
            alt="Author Avatar"
            className="w-12 h-12 rounded-full mr-4"
          />
          <div>
            <span className="text-lg font-semibold text-primary">
              {author.displayName || author.username || "Unknown"}
            </span>
            <p className="text-xs opacity-60">
              Joined:{" "}
              {author.createdAt
                ? new Date(author.createdAt).toLocaleDateString()
                : "Jan 2022"}
            </p>
          </div>
        </div>
        <p className="text-sm opacity-70 mt-3">
          {author.bio ||
            "Passionate about embedded systems and open-source. Sharing my projects with the community!"}
        </p>
        <button
          type="button"
          className="mt-3 inline-block btn btn-neutral btn-sm w-full text-center todoElement"
          disabled
        >
          View Profile
        </button>
      </div>
    </section>
  );
};

export default AppSidebarAuthor;
