import { usePersistedFloatingWindowHandle } from "@/core/hooks";

export const FLOATING_MIGHT_RANGE_FINDER_NAME = "might-ranger-finder";
export const FLOATING_NPC_SIMULATOR_NAME = "npc-simulator";

export const useFloatingMightRangeFinder = () => {
  return usePersistedFloatingWindowHandle(FLOATING_MIGHT_RANGE_FINDER_NAME);
};

export const useFloatingNpcSimulator = () => {
  return usePersistedFloatingWindowHandle(FLOATING_NPC_SIMULATOR_NAME);
};
