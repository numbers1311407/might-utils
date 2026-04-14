import { useCallback, useMemo } from "react";
import { useRosterChar } from "./use-roster-char.js";
import {
  useRosterStoreApi as rosterApi,
  useClassTagsStoreApi as classTagsApi,
} from "@/model/store";

export const useRosterCharApi = (name, options = {}) => {
  const char = useRosterChar(name, options);
  const charClass = char?.class;

  const addTags = useCallback(
    (...tags) => {
      if (name) rosterApi.addCharTags(name, tags);
    },
    [name],
  );

  const removeTags = useCallback(
    (...tags) => {
      if (name) rosterApi.removeCharTags(name, tags);
    },
    [name],
  );

  const clearTags = useCallback(() => {
    if (name) rosterApi.updateChar(name, { tags: [] });
  }, [name]);

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
