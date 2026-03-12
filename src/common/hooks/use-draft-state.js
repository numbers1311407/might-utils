import { useState } from "react";
import { deepEqual } from "fast-equals";

export const useDraftState = (upstreamState) => {
  const [cachedUpstreamState, setCachedUpstreamState] = useState(upstreamState);
  const [state, setState] = useState(upstreamState);

  if (!deepEqual(upstreamState, cachedUpstreamState)) {
    setCachedUpstreamState(upstreamState);
    setState(upstreamState);
  }

  return [state, setState];
};
