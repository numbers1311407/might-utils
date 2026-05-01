import { useCallback, useState } from "react";

// simple useState wrapper providing a default party state, preselecting the
// option for all party members
export const usePartyState = (party, initialFields = ["level", "warden"]) => {
  const [map, setMap] = useState(() => {
    return new Map(party.map((slot) => [slot.name, initialFields.slice()]));
  });

  const set = useCallback(
    (name, update, op) => {
      const _map = new Map(map);

      if (name === "*") {
        name = party.map((slot) => slot.name);
      }

      if (typeof name === "string") {
        name = [name];
      }

      if (typeof update === "string") {
        update = [update];
      }

      if (op === "toggle") {
        if (update.length > 1) {
          throw new Error("toggle can only be done on one field at a time");
        }
        op = name.every((n) => !!map.get(n)?.includes(update[0]))
          ? "remove"
          : "add";
      }

      name.flat().forEach((name) => {
        const current = map.get(name) || [];
        let _update = update?.slice() || [];

        if (op === "add") {
          _update = [...new Set(_update).union(new Set(current))];
        } else if (op === "remove") {
          _update = current.filter((field) => !_update.includes(field));
        }

        if (!_update?.length) {
          _map.delete(name);
        } else {
          _map.set(name, _update);
        }
      });

      setMap(_map);
    },
    [map, party],
  );

  const toggle = useCallback(
    (name, update) => {
      return set(name, update, "toggle");
    },
    [set],
  );

  const add = useCallback(
    (name, update) => {
      return set(name, update, "add");
    },
    [set],
  );

  const remove = useCallback(
    (name, update) => {
      return set(name, update, "remove");
    },
    [set],
  );

  const exclude = useCallback(
    (name) => {
      return set(name, null);
    },
    [set],
  );

  return [
    map,
    {
      setFields: set,
      addFields: add,
      removeFields: remove,
      toggleField: toggle,
      exclude,
    },
  ];
};
