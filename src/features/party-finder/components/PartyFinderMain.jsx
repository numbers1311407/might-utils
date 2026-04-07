import { Box } from "@mantine/core";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { LoadingPage, PageTitle } from "@/core/components";
import { PartyFinderResults } from "./PartyFinderResults.jsx";
import { usePartyFinderContext } from "../context";
import { FindPartiesError } from "../find-parties/find-parties-error.js";

const UNEXPECTED_ERROR_MESSAGE =
  "An unexpected error occurred. Please attempt to fix any " +
  "form input errors if they may exist and try to refresh the page.";

const ErrorPage = ({ error, resetErrorBoundary: _r }) => {
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
        section="Planning & Data"
        title="Party Generator"
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
