import React from "react";
import { ProjectDetails } from "@shared/domain/readModels/project/ProjectDetails.ts";
import MarkdownText from "@sharedComponents/MarkdownText.tsx";

const AppDescription: React.FC<{ project: ProjectDetails }> = ({
  project: {
    version: { app_metadata },
  },
}) => (
  <section className="bg-gray-800 p-6 rounded-lg shadow-lg">
    <h2 className="text-2xl font-semibold text-slate-100 mb-4">Description</h2>
    {app_metadata.description ? (
      <MarkdownText className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl prose-invert max-w-none text-slate-300">
        {app_metadata.description}
      </MarkdownText>
    ) : (
      <p className="text-slate-300">No description provided.</p>
    )}
  </section>
);

export default AppDescription;
