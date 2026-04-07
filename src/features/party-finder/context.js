import { createContext, use } from "react";

export const PartyFinderContext = createContext();
export const usePartyFinderContext = () => use(PartyFinderContext);
