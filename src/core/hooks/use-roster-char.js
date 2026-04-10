import { useMemo } from "react";
import { useRosterStoreApi as api } from "@/model/store";

export const useRosterChar = (charId, options = {}) => {
  const { classTags = false } = options;

  return useMemo(() => {
    return api.getChar(charId, { classTags });
  }, [charId, classTags]);
};
