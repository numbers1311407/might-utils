import { useInsertionEffect, useRef, useCallback } from "react";

export const useStableCallback = (fn) => {
  const ref = useRef(fn);

  useInsertionEffect(() => {
    ref.current = fn;
  });

  return useCallback((...args) => {
    return ref.current(...args);
  }, []);
};
