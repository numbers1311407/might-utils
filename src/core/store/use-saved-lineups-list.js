import { useMemo } from "react";
import { useSavedLineupsStore } from "./use-saved-lineups-store.js";

export const useSavedLineupsList = () => {
  const registry = useSavedLineupsStore((store) => store.registry);
  return useMemo(() => Object.values(registry), [registry]);
};
