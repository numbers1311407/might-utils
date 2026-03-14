import { createStore } from "@/utils";
import { defaultOptions } from "./find-lineups.js";

export const useLineupsStore = createStore(
  "might-utils-lineups",
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
