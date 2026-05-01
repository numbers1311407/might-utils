import { useRoute } from "wouter";
import { PartyIndex } from "./PartyIndex.jsx";
import { Party } from "./Party.jsx";

export const Parties = () => {
  const [_match, { id: partyId }] = useRoute("/parties/:id?");
  return partyId ? <Party id={partyId} /> : <PartyIndex />;
};
