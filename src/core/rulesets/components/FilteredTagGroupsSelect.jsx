import { useCallback } from "react";
import { intersection } from "@/utils";
import { TagGroupsSelect } from "@/core/components";

// filters tag groups by party, ensuring every party member has
// at least one of the tags.
export const FilteredTagGroupsSelect = ({ party, ...props }) => {
  const filter = useCallback(
    (group) => {
      return party.every(
        (slot) => !!intersection(slot.tags, group.tags).length,
      );
    },
    [party],
  );
  return <TagGroupsSelect filter={filter} {...props} />;
};
