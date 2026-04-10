import { useMemo } from "react";
import { usePartiesStore } from "@/model/store";

export const usePartiesList = () => {
  const registry = usePartiesStore((store) => store.registry);
  return useMemo(() => Object.values(registry), [registry]);
};
