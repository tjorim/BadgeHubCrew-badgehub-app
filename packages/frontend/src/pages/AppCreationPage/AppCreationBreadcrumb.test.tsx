import { render, screen } from "@__test__";
import { describe, expect, it } from "vitest";
import AppCreationBreadcrumb from "./AppCreationBreadcrumb.tsx";

describe("AppCreationBreadcrumb", () => {
  it("renders home link and current page label", () => {
    render(<AppCreationBreadcrumb />);

    expect(screen.getByRole("link", { name: /home/i })).toHaveAttribute(
      "href",
      "/"
    );
    expect(screen.getByText(/create new app/i)).toBeInTheDocument();
  });
});
