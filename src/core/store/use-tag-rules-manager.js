import { useCallback, useMemo, useState } from "react";
import { useDraftState } from "@/core/hooks";
import { useTagRulesStore, useTagRulesStoreApi as api } from "@/core/store";
import { defaultFiltersTagRules } from "@/core/config/defaults";
import { prepareTagRules } from "@/core/tags";

const defaultIdMap = {
  filters: [defaultFiltersTagRules.id],
};
const defaultIds = Object.values(defaultIdMap).flat();

export const useTagRulesManager = (type, initialId) => {
  const active = useTagRulesStore((store) => store.active[type] || []);
  const firstActiveId = active[0];
  const defaultId = defaultIdMap[type]?.[0];
  const [currentId, setCurrentId] = useDraftState(
    initialId || firstActiveId || defaultId,
  );
  const current = useTagRulesStore((store) => store.sets[currentId]);
  const currentDefaultDirty = useTagRulesStore((store) =>
    store.dirtyDefaults.includes(currentId),
  );
  const currentDefault = defaultIds.includes(currentId);
  const currentActive = active.includes(currentId);

  const setCurrent = useCallback(
    (set) => {
      setCurrentId(set.id);
    },
    [setCurrentId],
  );

  const duplicateCurrent = useCallback(
    (name) => {
      const baseName = (name ||= current.name);
      let i = 1;
      while (!api.nameAvailable(name)) {
        name = `${baseName} (${i++})`;
      }
      const { id: _, ...rest } = current;
      return { ...rest, name };
    },
    [current],
  );

  const removeCurrent = useCallback(() => {
    if (!defaultIds.includes(currentId)) {
      setCurrentId(defaultId);
      api.removeSet(currentId);
    }
  }, [currentId, defaultId]);

  const addCurrentRule = useCallback(
    (rule) => {
      api.addRule(currentId, rule);
    },
    [currentId],
  );

  const removeCurrentRule = useCallback(
    (rule) => {
      api.removeRule(currentId, rule);
    },
    [currentId],
  );

  const renameCurrent = useCallback(
    (name) => {
      if (!defaultIds.includes(currentId)) {
        api.renameSet(currentId, name);
      }
    },
    [currentId],
  );

  const activateCurrent = useCallback(() => {
    api.activate(currentId);
  }, [currentId]);

  const deactivateCurrent = useCallback(() => {
    api.deactivate(currentId);
  }, [currentId]);

  const sortCurrent = useCallback(() => {
    api.sortRuleset(currentId);
  }, [currentId]);

  const currentSorted = useMemo(() => {
    return api.isRulesetSorted(current.id);
  }, [current]);

  return [
    current,
    setCurrent,
    {
      currentDefault,
      currentSorted,
      currentDefaultDirty,
      currentActive,
      activateCurrent,
      addCurrentRule,
      deactivateCurrent,
      duplicateCurrent,
      removeCurrent,
      removeCurrentRule,
      renameCurrent,
      sortCurrent,
    },
  ];
};
