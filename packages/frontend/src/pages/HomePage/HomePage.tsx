import { useProjectSummariesFetcher } from "@hooks/useProjectSummariesFetcher.ts";
import { useTitle } from "@hooks/useTitle.ts";
import { AppGridWithFilterAndPagination } from "@sharedComponents/AppGridWithFilterAndPagination.tsx";
import Hero from "@sharedComponents/Hero.tsx";
import PageLayout from "@sharedComponents/PageLayout.tsx";
import { memo, useState } from "react";
import { publicTsRestClient as defaultTsRestClient } from "../../api/tsRestClient.ts";

interface AppProps {
  tsRestClient?: typeof defaultTsRestClient;
}

const HomePage = memo(({ tsRestClient = defaultTsRestClient }: AppProps) => {
  useTitle("");
  const appFetcher = useProjectSummariesFetcher(tsRestClient);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <PageLayout
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      data-testid="main-page"
    >
      <Hero />
      <AppGridWithFilterAndPagination
        appFetcher={appFetcher}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
    </PageLayout>
  );
});

export default HomePage;
