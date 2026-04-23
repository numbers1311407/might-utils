import { use, createContext } from "react";

export const PartyDiffContext = createContext();
export const usePartyDiffContext = () => use(PartyDiffContext);
