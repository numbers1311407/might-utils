import { useCallback, useState } from "react";
import {
  useTagRulesStore,
  useTagRulesStoreApi as api,
} from "./use-tag-rules-store.js";
import { defaultFiltersTagRules } from "../defaults.js";

// TODO this defaults code needs to be lifted up and improved
const defaultIdMap = {
  filters: [defaultFiltersTagRules.id],
};
const defaultIds = Object.values(defaultIdMap).flat();

export const useTagRulesManager = (type, initialId) => {
  const defaultId = defaultIdMap[type]?.[0];
  const [currentId, setCurrentId] = useState(initialId || defaultId);
  const current = useTagRulesStore((store) => store.sets[currentId]);
  const active = useTagRulesStore((store) => store.active[type] || []);
  const currentDefaultDirty = useTagRulesStore((store) =>
    store.dirtyDefaults.includes(currentId),
  );
  const currentDefault = defaultIds.includes(current.id);
  const currentActive = active.includes(current.id);

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
      api.addSet(
        {
          name,
          type: current.type,
          rules: current.rules,
        },
        (set) => {
          setCurrentId(set.id);
        },
      );
    },
    [current, setCurrentId],
  );

  const removeCurrent = useCallback(() => {
    if (!defaultIds.includes(currentId)) {
      setCurrentId(defaultId);
      api.removeSet(currentId);
    }
  }, [currentId, defaultId]);

  const addCurrentRule = useCallback(
    (size, rule) => {
      api.addRule(currentId, size, rule);
    },
    [currentId],
  );

  const removeCurrentRule = useCallback(
    (size, rule) => {
      api.removeRule(currentId, size, rule);
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

  return [
    current,
    setCurrent,
    {
      currentDefault,
      currentDefaultDirty,
      currentActive,
      activateCurrent,
      addCurrentRule,
      deactivateCurrent,
      duplicateCurrent,
      removeCurrent,
      removeCurrentRule,
      renameCurrent,
    },
  ];
};
