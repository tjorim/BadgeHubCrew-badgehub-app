import { describe, expect, it } from "vitest";
import {
  dummyApps,
  render,
  screen,
  tsRestClientWithApps,
  waitFor,
} from "@__test__";
import AppDetailPage from "./AppDetailPage.tsx";

describe("AppDetailPage", { timeout: 1000_000 }, () => {
  it("renders app details when found", async () => {
    const app = dummyApps[0]!.summary;
    render(
      <AppDetailPage
        tsRestClient={tsRestClientWithApps(dummyApps)}
        slug={"dummy-app-1"}
      />
    );
    // Wait until the detail page renders
    await screen.findByTestId("app-detail-page");

    expect(screen.getByTestId("app-detail-name")).toHaveTextContent(app.name!);
    expect(
      await screen.findByText("This is a longer test app description.")
    ).toBeInTheDocument();
    expect(screen.queryByText(app.description!)).not.toBeInTheDocument();
    expect(screen.getAllByText(app.categories![0]!).length).toBeGreaterThan(0);
    if (app.badges && app.badges.length > 0) {
      expect(screen.queryAllByText(app.badges[0]!).length).toBeGreaterThan(0);
    }
  });

  it("falls back to the short description when long description is empty", async () => {
    const app = dummyApps[1]!.summary;
    render(
      <AppDetailPage
        tsRestClient={tsRestClientWithApps(dummyApps)}
        slug={"dummy-app-2"}
      />
    );

    await screen.findByTestId("app-detail-page");

    expect(await screen.findByText(app.description!)).toBeInTheDocument();
  });

  it("renders the long description as Markdown", async () => {
    const firstApp = dummyApps[0]!;
    const appsWithMarkdown = [
      {
        ...firstApp,
        details: {
          ...firstApp.details,
          version: {
            ...firstApp.details.version,
            app_metadata: {
              ...firstApp.details.version.app_metadata,
              long_description: "## Features\n\n- Offline support",
            },
          },
        },
      },
      ...dummyApps.slice(1),
    ];

    render(
      <AppDetailPage
        tsRestClient={tsRestClientWithApps(appsWithMarkdown)}
        slug="dummy-app-1"
      />
    );

    expect(
      await screen.findByRole("heading", { level: 2, name: "Features" })
    ).toBeInTheDocument();
    expect(screen.getByText("Offline support").tagName).toBe("LI");
  });

  it("renders the app revision", async () => {
    const app = dummyApps[0]!.summary;
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
