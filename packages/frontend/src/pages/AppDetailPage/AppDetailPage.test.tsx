import {
  dummyApps,
  render,
  screen,
  tsRestClientWithApps,
  waitFor,
} from "@__test__";
import { describe, expect, it } from "vitest";
import AppDetailPage from "./AppDetailPage.tsx";

describe("AppDetailPage", { timeout: 1000_000 }, () => {
  it("renders app details when found", async () => {
    const app = dummyApps[0]?.summary;
    expect(app).toBeDefined();
    if (!app) {
      throw new Error("Expected dummy app summary");
    }
    render(
      <AppDetailPage
        tsRestClient={tsRestClientWithApps(dummyApps)}
        slug={"dummy-app-1"}
      />
    );
    // Wait until the detail page renders
    await screen.findByTestId("app-detail-page");

    expect(screen.getByTestId("app-detail-name")).toHaveTextContent(
      app.name ?? ""
    );
    expect(
      await screen.findByText("This is a longer test app description.")
    ).toBeInTheDocument();
    if (app.description) {
      expect(screen.queryByText(app.description)).not.toBeInTheDocument();
    }
    const firstCategory = app.categories?.[0];
    if (firstCategory) {
      expect(screen.getAllByText(firstCategory).length).toBeGreaterThan(0);
    }
    const firstBadge = app.badges?.[0];
    if (firstBadge) {
      expect(screen.queryAllByText(firstBadge).length).toBeGreaterThan(0);
    }
  });

  it("falls back to the short description when long description is empty", async () => {
    const app = dummyApps[1]?.summary;
    expect(app?.description).toBeDefined();
    if (!app?.description) {
      throw new Error("Expected dummy app description");
    }
    render(
      <AppDetailPage
        tsRestClient={tsRestClientWithApps(dummyApps)}
        slug={"dummy-app-2"}
      />
    );

    await screen.findByTestId("app-detail-page");

    expect(await screen.findByText(app.description)).toBeInTheDocument();
  });

  it("renders the app revision", async () => {
    const app = dummyApps[0]?.summary;
    expect(app).toBeDefined();
    if (!app) {
      throw new Error("Expected dummy app summary");
    }
    render(
      <AppDetailPage
        tsRestClient={tsRestClientWithApps(dummyApps)}
        slug={"dummy-app-1"}
      />
    );
    // Revision text is rendered as "Revision: {revision}", so use a flexible matcher
    expect(
      (
        await screen.findAllByText((content) =>
          content.includes(String(app.revision ?? ""))
        )
      ).length
    ).toBeGreaterThan(0);
  });

  it.skip("shows error if app not found", async () => {
    //TODO
    render(
      <AppDetailPage
        tsRestClient={tsRestClientWithApps(dummyApps)}
        slug={"dummy-app-1"}
      />
    );
    await waitFor(() =>
      expect(screen.getByTestId("app-detail-error")).toBeInTheDocument()
    );
  });
});
