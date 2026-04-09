import { useShallow } from "zustand/react/shallow";
import { useEffect } from "react";
import { useFloatingWindow } from "@mantine/hooks";
import { useStableCallback } from "@/core/hooks";
import { useFloatingWindowStore } from "@/core/store";

const DEFAULT_HOOK_OPTIONS = {
  enabled: true,
  constrainToViewport: true,
  constrainOffset: 20,
};

export const usePersistedFloatingWindowApi = () => {
  return useFloatingWindowStore(
    useShallow((state) => ({
      close: state.close,
      open: state.open,
      raise: state.raise,
      reset: state.reset,
      resetAll: state.resetAll,
      sync: state.sync,
      toggle: state.toggle,
    })),
  );
};

export const usePersistedFloatingWindowHandle = (name) => {
  const baseApi = usePersistedFloatingWindowApi();
  const store = useFloatingWindowStore((store) => store.windows[name]);
  const stored = !!store;

  const {
    currentPosition: initialPosition,
    opened = false,
    ...restStore
  } = store || {};

  const api = useMemo(
    () => ({
      close: () => baseApi.close(name),
      open: () => baseApi.open(name),
      raise: () => baseApi.raise(name),
      reset: (pos) => baseApi.reset(name, pos),
      sync: (pos) => baseApi.sync(name, pos),
      toggle: () => baseApi.toggle(name),
    }),
    [baseApi, name],
  );

  return { ...restStore, stored, opened, initialPosition, api };
};

export const usePersistedFloatingWindow = (name, options = {}) => {
  const {
    initialPosition: _initialPosition,
    onPositionChange: _onPositionChange,
    ...hookOptions
  } = options;

  const {
    api,
    opened,
    stored,
    storePosition,
    zIndex,
    initialPosition = _initialPosition,
  } = usePersistedFloatingWindowHandle(name);

  useEffect(() => {
    if (!stored || !storePosition) {
      api.sync(_initialPosition);
    }
  }, [stored, storePosition]);

  const onPositionChange = useStableCallback((pos) => {
    _onPositionChange?.(pos);
    storePosition?.(pos);
  });

  const hookReturnValue = useFloatingWindow({
    ...DEFAULT_HOOK_OPTIONS,
    ...hookOptions,
    initialPosition,
    onPositionChange,
  });

  return { ...hookReturnValue, ...api, zIndex, opened };
};
