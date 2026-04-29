import { createStore } from "@/model/store/helpers";
import { finderOptionsSchema } from "@/model/schemas";
import { defaultFindPartiesOptions as defaultOptions } from "@/config/defaults";

export const usePartyFinderStore = createStore(
  "might-utils-party-finder-options",
  (set, get) => ({
    options: finderOptionsSchema.parse(defaultOptions),
    setOption: (name, value) => {
      set(({ options }) => {
        options[name] = value ?? defaultOptions[name];
        finderOptionsSchema.parse(options);
      });
    },
    mergeOptions: (update) => {
      set((state) => {
        const result = finderOptionsSchema.safeParse({
          ...state.options,
          ...update,
        });
        if (result.success) {
          state.options = result.data;
        }
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
