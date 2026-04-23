import { useCallback } from "react";

export const useSorter = (sort) => {
  return useCallback(
    (parties, selector) => {
      const copy = parties.slice();
      const sorts = sort.split(" ");
      const lastSort = sorts[sorts.length - 1];

      try {
        return copy.sort((_a, _b) => {
          const a = selector?.(_a) ?? _a;
          const b = selector?.(_b) ?? _b;

          for (const sort of sorts) {
            const [_match, rev, field] = sort.match(/^(-)?(\w+)/);

            if (a[field] === b[field] && sort !== lastSort) {
              continue;
            }

            return (a[field] - b[field]) * (rev ? -1 : 1);
          }
        });
      } catch (e) {
        console.error(e);
        return copy;
      }
    },
    [sort],
  );
};
