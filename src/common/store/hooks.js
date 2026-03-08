import superjson from "superjson";
import { useCallback, useState, useMemo } from "react";
import { useLocalStorage } from "@mantine/hooks";
import { getDeep, setDeep } from "@/utils";

const defaultValue = {};

export const useAppStorage = () => {
  const [data, setData] = useLocalStorage({
    key: "might-utils",
    defaultValue,
    getInitialValueInEffect: false,
    serialize: superjson.stringify,
    deserialize: (str) =>
      str === undefined ? defaultValue : superjson.parse(str),
  });

  return [data, setData];
};

export const createAppStorageSliceHook = (pathPrefix) => {
  pathPrefix = pathPrefix ? pathPrefix.split(".") : "";

  function useHook(initialPath) {
    const [store, setStore] = useAppStorage();
    const [sealedPath] = useState(initialPath);
    const path = useMemo(() => {
      const path = sealedPath ? sealedPath.split(".") : [];
      return [...pathPrefix, ...path];
    }, [sealedPath]);

    const [value, setValue] = useState(getDeep(store, path));

    const persistValue = useCallback(
      (value) => setStore(setDeep(store, path, value)),
      [store, setStore, path],
    );

    return [value, setValue, persistValue];
  }
  return useHook;
};
