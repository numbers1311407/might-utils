import { Box } from "@mantine/core";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { LoadingPage, PageTitle } from "@/core/components";
import * as titles from "@/config/constants/titles";
import { PartyFinderResults } from "./PartyFinderResults.jsx";
import { PartyFinderError } from "./PartyFinderError.jsx";
import { usePartyFinderContext } from "../context";

export const PartyFinderMain = () => {
  const { key } = usePartyFinderContext();

  return (
    <Box>
      <PageTitle
        section={titles.PARTY_CATEGORY}
        title={titles.PARTY_FINDER_TITLE}
        subtitle={
          "Add your roster and group preferences, plug in your target might, " +
          "and generate your party!"
        }
      />
      <ErrorBoundary resetKeys={[key]} FallbackComponent={PartyFinderError}>
        <Suspense fallback={<LoadingPage />}>
          <PartyFinderResults />
        </Suspense>
      </ErrorBoundary>
    </Box>
  );
};
