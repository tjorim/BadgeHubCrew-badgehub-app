import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import AppCardTags from "./AppCardTags.tsx";

describe("AppCardTags", () => {
  it("shows one bounded tag and an explicit overflow count per group", () => {
    render(
      <AppCardTags
        categories={["A very long category name", "Games", "Utilities"]}
        badges={["why2025", "mch2022"]}
      />
    );

    const categories = screen.getByRole("group", { name: "Categories" });
    const badges = screen.getByRole("group", { name: "Badges" });

    expect(
      within(categories).getByText("A very long category name")
    ).toHaveClass("truncate");
    expect(within(categories).queryByText("Games")).not.toBeInTheDocument();
    expect(
      within(categories).getByLabelText("2 more categories: Games, Utilities")
    ).toHaveTextContent("+2");
    expect(within(badges).getByTitle("why2025")).toHaveTextContent("why2025");
    expect(
      within(badges).getByLabelText("1 more badge: mch2022")
    ).toHaveTextContent("+1");
  });

  it("omits empty groups and overflow counts for single values", () => {
    render(<AppCardTags categories={["Games"]} badges={undefined} />);

    expect(
      screen.getByRole("group", { name: "Categories" })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("group", { name: "Badges" })
    ).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/more categories/i)).not.toBeInTheDocument();
  });

  it("handles null tag arrays without rendering groups", () => {
    render(<AppCardTags categories={null} badges={null} />);

    expect(screen.queryByRole("group")).not.toBeInTheDocument();
  });
});
