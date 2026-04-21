import { LoadingPage } from "@/core/components";
import { PartyResults } from "./PartyResults.jsx";
import { useFindPartiesResults } from "../hooks";

export const PartyFinderResults = () => {
  const { parties, isPending } = useFindPartiesResults();

  if (isPending) {
    return <LoadingPage />;
  }

  // TODO here's where we wanna show errors
  if (!parties.length) {
    return "No results";
  }

  return <PartyResults />;
};
