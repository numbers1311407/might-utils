import { useShallow } from "zustand/react/shallow";
import { useTagGroupsStore, useTagGroupsStoreApi as api } from "@/model/store";

export const useTagGroups = () => {
  const tagGroups = useTagGroupsStore(
    useShallow((store) => Object.values(store.registry)),
  );

  return [tagGroups, api];
};
