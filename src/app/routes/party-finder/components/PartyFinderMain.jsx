import { Box } from "@mantine/core";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { LoadingPage, PageTitle } from "@/core/components";
import { FindPartiesError } from "@/core/party-finder";
import * as titles from "@/config/constants/titles";
import { PartyFinderResults } from "./PartyFinderResults.jsx";
import { usePartyFinderContext } from "../context";

const UNEXPECTED_ERROR_MESSAGE =
  "An unexpected error occurred. Please be sure you've selected all options and corrected any " +
  "form input errors if they exist and try to refresh the page.";

const ErrorPage = ({ error }) => {
  const message =
    error instanceof FindPartiesError
      ? error.message
      : UNEXPECTED_ERROR_MESSAGE;

  return message;
};

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
      <ErrorBoundary resetKeys={[key]} FallbackComponent={ErrorPage}>
        <Suspense fallback={<LoadingPage />}>
          <PartyFinderResults />
        </Suspense>
      </ErrorBoundary>
    </Box>
  );
};
