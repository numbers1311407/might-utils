import { createContext, use } from "react";

export const TagRulesContext = createContext({});
export const useTagRulesContext = () => use(TagRulesContext);
