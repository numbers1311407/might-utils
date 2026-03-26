import { Box, Title } from "@mantine/core";
import { Suspense } from "react";
import { LoadingPage } from "@/core/components";
import { LineupsResults } from "./LineupsResults.jsx";

export const LineupsMain = () => {
  return (
    <Box>
      <Title order={2} mb="xs">
        Party Finder
      </Title>
      <Suspense fallback={<LoadingPage />}>
        <LineupsResults />
      </Suspense>
    </Box>
  );
};
