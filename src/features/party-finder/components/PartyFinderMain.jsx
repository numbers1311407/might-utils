import { Box } from "@mantine/core";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { LoadingPage, PageTitle } from "@/core/components";
import { PartyFinderResults } from "./PartyFinderResults.jsx";

export const PartyFinderMain = () => {
  return (
    <Box>
      <PageTitle
        section="Might Party Finder"
        title="Find Your Party"
        subtitle="Add your roster and group preferences, plug in your target might, and find your party!"
      />
      <ErrorBoundary fallback="o.o">
        <Suspense fallback={<LoadingPage />}>
          <PartyFinderResults />
        </Suspense>
      </ErrorBoundary>
    </Box>
  );
};
