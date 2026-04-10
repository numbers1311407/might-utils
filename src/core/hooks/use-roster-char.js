import { useMemo } from "react";
import { useRosterStore, useClassTagsStore } from "@/model/store";
import { useShallow } from "zustand/react/shallow";
import { intersection } from "@/utils";

export const useRosterChar = (charId, options = {}) => {
  const { classTags: mergeClassTags = false } = options;

  // NOTE this hookreally shines on the weakness of relying on
  // the zustand API too much.  It's great to be outside the react
  // render cycle until you want to be notified of changes at a lower
  // level than your api call.
  //
  // TODO probably go back and rely more on selector hooks than trying
  // to do external APIs. I got that pattern in my head then took it
  // to places that made no sense.
  const rosterChar = useRosterStore(
    useShallow((state) => state.roster.find((char) => char.id === charId)),
  );

  const classTags = useClassTagsStore(
    useShallow(
      (store) => (rosterChar?.class && store.tags[rosterChar.class]) || [],
    ),
  );

  return useMemo(() => {
    if (!rosterChar) return undefined;

    return {
      ...rosterChar,
      tags: mergeClassTags
        ? intersection(rosterChar.tags, classTags).sort()
        : rosterChar.tags,
    };
  }, [mergeClassTags, classTags, rosterChar]);
};
