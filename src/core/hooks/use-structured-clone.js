import { useRef } from "react";
import { deepEqual } from "fast-equals";

export const useStructuredClone = (value) => {
  const ref = useRef();

  if (!deepEqual(value, ref.current)) {
    ref.current = structuredClone(value);
  }

  return ref.current;
};
