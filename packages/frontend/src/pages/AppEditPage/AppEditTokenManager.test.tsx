import { render, screen } from "@__test__";
import { getFreshAuthorizedTsRestClient } from "@api/tsRestClient.ts";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import AppEditTokenManager from "./AppEditTokenManager.tsx";

vi.mock("@api/tsRestClient.ts", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@api/tsRestClient.ts")>();
  return {
    ...actual,
    getFreshAuthorizedTsRestClient: vi.fn(),
  };
});

const keycloak = {
  updateToken: vi.fn().mockResolvedValue(true),
} as unknown as import("keycloak-js").default;

const baseClient = {
  getProjectApiTokenMetadata: vi.fn(),
  createProjectAPIToken: vi.fn(),
  revokeProjectAPIToken: vi.fn(),
};

describe("AppEditTokenManager", () => {
  it("renders empty state when no token exists", async () => {
    vi.mocked(getFreshAuthorizedTsRestClient).mockResolvedValue({
      ...baseClient,
      getProjectApiTokenMetadata: vi.fn().mockResolvedValue({ status: 404 }),
    } as unknown as Awaited<ReturnType<typeof getFreshAuthorizedTsRestClient>>);

    render(<AppEditTokenManager slug="demo" keycloak={keycloak} />);

    expect(await screen.findByText(/no active api token/i)).toBeInTheDocument();
  });

  it("creates a new token and shows it", async () => {
    const user = userEvent.setup();
    vi.mocked(getFreshAuthorizedTsRestClient).mockResolvedValue({
      ...baseClient,
      getProjectApiTokenMetadata: vi.fn().mockResolvedValue({
        status: 404,
      }),
      createProjectAPIToken: vi.fn().mockResolvedValue({
        status: 200,
        body: { token: "new-token-value" },
      }),
    } as unknown as Awaited<ReturnType<typeof getFreshAuthorizedTsRestClient>>);

    render(<AppEditTokenManager slug="demo" keycloak={keycloak} />);

    await user.click(await screen.findByText(/generate new token/i));

    expect(
      await screen.findByDisplayValue("new-token-value")
    ).toBeInTheDocument();
  });
});
