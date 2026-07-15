import { dummyApps } from "@__test__/fixtures";
import { matchRoute } from "@__test__/routeContractMatch.ts";
import type { publicTsRestClient as defaultPrivateTsRestClient } from "@api/tsRestClient.ts";
import { tsRestApiContracts } from "@shared/contracts/restContracts.ts";
import { type ApiFetcherArgs, initClient } from "@ts-rest/core";

export function privateTsRestClientBuilder(apps = dummyApps) {
  return initClient(tsRestApiContracts, {
    baseUrl: "",
    api: async (args: ApiFetcherArgs) => {
      if (!matchRoute(args, tsRestApiContracts.getUserDraftProjects)) {
        return {
          status: 404,
          body: { reason: "Not found" },
          headers: new Headers(),
        };
      }

      // Optionally filter by userId if needed
      return {
        status: 200,
        body: apps.map((a) => a.summary),
        headers: new Headers(),
      };
    },
  }) as typeof defaultPrivateTsRestClient;
}

export function privateTsRestClientWithError() {
  return initClient(tsRestApiContracts, {
    baseUrl: "",
    api: async (args: ApiFetcherArgs) => {
      if (!matchRoute(args, tsRestApiContracts.getUserDraftProjects)) {
        return {
          status: 404,
          body: { reason: "Not found" },
          headers: new Headers(),
        };
      }
      throw new Error("API error");
    },
  }) as typeof defaultPrivateTsRestClient;
}
