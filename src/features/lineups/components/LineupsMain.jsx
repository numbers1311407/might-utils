import { Box, Title } from "@mantine/core";
import { Suspense } from "react";
import { LoadingPage, PageTitle } from "@/core/components";
import { LineupsResults } from "./LineupsResults.jsx";

export const LineupsMain = () => {
  return (
    <Box>
      <PageTitle
        title="Party Finder"
        subtitle="Add your roster and group preferences, plug in your target might, and find your party!"
      />
      <Suspense fallback={<LoadingPage />}>
        <LineupsResults />
      </Suspense>
    </Box>
  );
};
