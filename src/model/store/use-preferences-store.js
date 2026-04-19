import { createStore } from "./helpers";

export const usePreferencesStore = createStore(
  "might-utils-preferences",
  (set, get) => ({
    showPartyDiffs: true,

    togglePreference: (preference) => {
      get().setPreference(preference);
    },

    setPreference: (preference, newValue) => {
      const { [preference]: value } = get();

      if (value === undefined) {
        return;
      }

      set((state) => {
        state[preference] = typeof newValue === "boolean" ? newValue : !value;
      });
    },
  }),
);
