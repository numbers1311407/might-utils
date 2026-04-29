import { useShallow } from "zustand/react/shallow";
import { useTagGroupsStore, useTagGroupsStoreApi as api } from "@/model/store";

export const useTagGroup = (id) => {
  const tagGroup = useTagGroupsStore(useShallow((store) => store.registry[id]));
  return [tagGroup, api];
};
