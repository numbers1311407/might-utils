import { LoadingPage } from "@/core/components";
import { GroupResults } from "./GroupResults.jsx";
import { PartyResults } from "./PartyResults.jsx";
import { useFindPartiesResults } from "../hooks";

export const PartyFinderResults = () => {
  const { groupBy, parties, isPending } = useFindPartiesResults();

  if (isPending) {
    return <LoadingPage />;
  }

  // TODO here's where we wanna show errors
  if (!parties.length) {
    return "No results";
  }

  return groupBy ? <GroupResults /> : <PartyResults />;
};
