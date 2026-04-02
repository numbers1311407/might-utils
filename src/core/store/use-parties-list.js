import { useMemo } from "react";
import { usePartiesStore } from "./use-parties-store.js";

export const usePartiesList = () => {
  const registry = usePartiesStore((store) => store.registry);
  return useMemo(() => Object.values(registry), [registry]);
};
