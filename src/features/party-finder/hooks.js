import { use, useEffect } from "react";
import { useSearchParams } from "wouter";
import { PartyFinderContext } from "./context.js";
import { usePartyFinderStore } from "./store.js";

export const useFindPartiesResults = () => {
  const { resultsPromise } = use(PartyFinderContext);
  return use(resultsPromise);
};

export function useFindPartiesOptionsUrlHydration() {
  const [searchParams, setSearchParams] = useSearchParams();
  const mergeOptions = usePartyFinderStore((state) => state.mergeOptions);

  useEffect(() => {
    if (!searchParams.size) return;

    const params = Object.fromEntries(searchParams.entries());

    mergeOptions(params);

    // Strip the search params from the URL and replace the history state
    // setSearchParams({}, { replace: true });
    setSearchParams({}, { replace: true });
  }, [searchParams, setSearchParams, mergeOptions]);
}
