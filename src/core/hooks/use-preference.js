import { useCallback } from "react";
import { usePreferencesStore } from "@/model/store";

const setPreference = usePreferencesStore.getState().setPreference;

export const usePreference = (preference) => {
  const preferenceValue = usePreferencesStore((store) => store[preference]);

  const setPreferenceValue = useCallback(
    (value) => {
      setPreference(preference, value);
    },
    [preference],
  );

  return [preferenceValue, setPreferenceValue];
};
