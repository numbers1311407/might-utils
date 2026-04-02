import { createStore } from "@/core/store/helpers";
import { defaultOptions } from "./find-parties";

export const usePartyFinderStore = createStore(
  "might-utils-parties",
  (set, get) => ({
    options: { ...defaultOptions },
    setOption: (name, value) => {
      set(({ options }) => {
        options[name] = value ?? defaultOptions[name];
      });
    },
    resetOption: (name) => {
      get().setOption(name, undefined);
    },
    resetOptions: () => {
      set((state) => {
        state.options = { ...defaultOptions };
      });
    },
  }),
);
