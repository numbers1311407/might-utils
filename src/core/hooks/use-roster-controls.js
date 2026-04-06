import { useRosterStore, useRosterStoreApi as api } from "@/core/store";

export const useRosterControls = () => {
  const activeOnly = useRosterStore((store) => store.activeOnly);
  return { activeOnly, setActiveOnly: api.setActiveOnly };
};
