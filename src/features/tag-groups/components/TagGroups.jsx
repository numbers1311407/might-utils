import { useTagGroupsStore } from "@/core/store";

export const TagGroups = () => {
  const groups = useTagGroupsStore((store) => store.groups);
  return Object.keys(groups).join(",");
};
