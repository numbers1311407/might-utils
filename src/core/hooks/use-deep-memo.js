import { useRef } from "react";
import { deepEqual } from "fast-equals";

export const useDeepMemo = (value) => {
  const ref = useRef();

  if (!deepEqual(value, ref.current)) {
    ref.current = value;
  }

  return ref.current;
};
