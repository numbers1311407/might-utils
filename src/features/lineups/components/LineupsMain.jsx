import { Suspense } from "react";
import { LineupsResults } from "./LineupsResults.jsx";
import { LoadingPage } from "@/common/components/LoadingPage.jsx";

export const LineupsMain = () => {
  return (
    <Suspense fallback={<LoadingPage />}>
      <LineupsResults />
    </Suspense>
  );
};
