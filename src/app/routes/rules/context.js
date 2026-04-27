import { createContext, use } from "react";

export const RulesContext = createContext({});
export const useRulesContext = () => use(RulesContext);
