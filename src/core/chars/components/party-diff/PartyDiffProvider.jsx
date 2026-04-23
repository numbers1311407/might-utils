import { usePartyDiff } from "@/core/hooks";
import { PartyDiffContext, usePartyDiffContext } from "./party-diff-context.js";

export const PartyDiffProvider = ({ partyId, children }) => {
  const diff = usePartyDiffContext();
  return diff ? children : <Provider partyId={partyId}>{children}</Provider>;
};

const Provider = ({ partyId, children }) => {
  const diff = usePartyDiff(partyId);
  return <PartyDiffContext value={diff}>{children}</PartyDiffContext>;
};
