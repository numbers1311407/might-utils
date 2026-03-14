import { Suspense } from "react";
import { LoadingPage } from "@/core/components";
import { LineupsResults } from "./LineupsResults.jsx";

export const LineupsMain = () => {
  return (
    <Suspense fallback={<LoadingPage />}>
      <LineupsResults />
    </Suspense>
  );
};
