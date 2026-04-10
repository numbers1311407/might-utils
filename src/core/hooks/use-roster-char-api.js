import { useCallback, useMemo } from "react";
import { useRosterChar } from "./use-roster-char.js";
import {
  useRosterStoreApi as rosterApi,
  useClassTagsStoreApi as classTagsApi,
} from "@/model/store";

export const useRosterCharApi = (charId, options = {}) => {
  const char = useRosterChar(charId, options);
  const charClass = char?.class;

  const addTags = useCallback(
    (...tags) => {
      if (charId) rosterApi.addCharTags(charId, tags);
    },
    [charId],
  );

  const removeTags = useCallback(
    (...tags) => {
      if (charId) rosterApi.removeCharTags(charId, tags);
    },
    [charId],
  );

  const clearTags = useCallback(() => {
    if (charId) rosterApi.updateChar(charId, { tags: [] });
  }, [charId]);

  const classTags = useMemo(() => {
    return charClass ? classTagsApi.getClassTags(charClass) : [];
  }, [charClass]);

  // always make sure tags are distinct from class tags
  const tags = useMemo(() => {
    return (char?.tags || []).filter((tag) => !classTags.includes(tag));
  }, [char, classTags]);

  return {
    addTags,
    removeTags,
    clearTags,
    char,
    tags,
    classTags,
  };
};
