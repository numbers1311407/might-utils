import { useCallback, useMemo } from "react";
import { useDraftState } from "@/core/hooks";
import { useRulesStore, useRulesStoreApi as api } from "@/model/store";
import { defaultFiltersRules, defaultTimeFlagRules } from "@/config/defaults";

const defaultIdMap = {
  filters: [defaultFiltersRules.id, defaultTimeFlagRules.id],
};
const defaultIds = Object.values(defaultIdMap).flat();

export const useRulesManager = (type, initialId) => {
  const active = useRulesStore((store) => store.active[type] || []);
  const defaultId = defaultIdMap[type]?.[0];
  const [currentId, setCurrentId] = useDraftState(initialId || defaultId);
  const current = useRulesStore((store) => store.sets[currentId]);
  const currentDefaultDirty = useRulesStore((store) =>
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
