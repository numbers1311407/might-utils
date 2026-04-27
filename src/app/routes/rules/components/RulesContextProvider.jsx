import { useCallback, useState } from "react";
import { RulesContext } from "../context.js";

export const RulesContextProvider = ({ children }) => {
  const [ruleSizeFilter, setRuleSizeFilter] = useState(undefined);

  const value = {
    ruleSizeFilter,
    setRuleSizeFilter,
  };

  return <RulesContext value={value}>{children}</RulesContext>;
};
