import { useMemo, useState } from "react";
import { usePartyFinderStore } from "@/model/store";
import { useTagGroup } from "@/core/hooks";
import { intersection } from "@/utils";

// probably poorly named and carrying some tech debt from the old
// `groupBy` behavior but the idea here is:
//
// 1. takes a party
// 2. look up the current tag group option from the finder as the default
// 3. return a setstate like interface for the tag group ID
// 4. determines if the initial or selected tag group is invalid and
//    forces an empty string for that ID
// 5. but also return the party with their tags limited to the tag group,
//    if the tag group is valid
//
export const usePartyTagGroupState = (party) => {
  const groupBy = usePartyFinderStore((store) => store.options.groupBy);
  const tagGroupIdWithDefault = groupBy.startsWith("tag:")
    ? groupBy.split(":")[1]
    : null;
  const [tagGroupId, setTagGroupId] = useState(tagGroupIdWithDefault);
  const [tagGroup] = useTagGroup(tagGroupId);

  const [valid, partyWithLimitedTags] = useMemo(() => {
    if (!tagGroup || !party) {
      return [false, party];
    }

    let valid = true;
    const _party = party.map((slot) => {
      const tags = intersection(slot.tags, tagGroup.tags);
      if (!tags.length) {
        valid = false;
      }
      return { ...slot, tags };
    });
    return [valid, _party];
  }, [party, tagGroup]);

  return [valid ? tagGroupId : "", setTagGroupId, partyWithLimitedTags];
};
