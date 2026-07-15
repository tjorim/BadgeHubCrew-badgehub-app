import { render, screen } from "@__test__";
import { dummyApps } from "@__test__/fixtures";
import { describe, expect, it } from "vitest";
import AppEditBreadcrumb from "./AppEditBreadcrumb.tsx";

describe("AppEditBreadcrumb", () => {
  it("renders breadcrumb links for the edit flow", () => {
    const project = dummyApps[0]?.details;
    expect(project).toBeDefined();
    if (!project) {
      throw new Error("Expected dummy project details");
    }
    render(<AppEditBreadcrumb project={project} />);

    expect(screen.getByRole("link", { name: /home/i })).toHaveAttribute(
      "href",
      "/"
    );
    expect(screen.getByRole("link", { name: /apps/i })).toHaveAttribute(
      "href",
      "/page/my-projects"
    );
    const projectName = project.version.app_metadata.name ?? "";
    expect(screen.getByRole("link", { name: projectName })).toHaveAttribute(
      "href",
      `/page/project/${project.slug}`
    );
    expect(screen.getByText(/edit/i)).toBeInTheDocument();
  });
});
