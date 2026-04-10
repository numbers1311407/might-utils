import { useRosterStore, useRosterStoreApi as api } from "@/model/store";

export const useRosterControls = () => {
  const activeOnly = useRosterStore((store) => store.activeOnly);
  return { activeOnly, setActiveOnly: api.setActiveOnly };
};
