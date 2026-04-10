import { usePersistedFloatingWindowHandle } from "@/core/hooks";

export const FLOATING_ROSTER_NAME = "roster";

export const useFloatingRoster = () => {
  return usePersistedFloatingWindowHandle(FLOATING_ROSTER_NAME);
};
