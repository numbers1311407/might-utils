import { useCallback, useState } from "react";
import { TagRulesContext } from "../context.js";

export const TagRulesContextProvider = ({ children }) => {
  const [ruleSizeFilter, setRuleSizeFilter] = useState(undefined);

  const value = {
    ruleSizeFilter,
    setRuleSizeFilter,
  };

  return <TagRulesContext value={value}>{children}</TagRulesContext>;
};
