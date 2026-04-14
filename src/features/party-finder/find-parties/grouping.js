// TODO refactor all the "grouping" code
// This all used to be very different and required more complexity but now it
// be a lot simpler. There's only two "grouping" types and they're both "comp":
// normal score comp and tags+score comp.

const SLOT_KEY = "comp";

const baseOverride = (slot, type, rest = {}) => ({
  [SLOT_KEY]: `${slot.level}/${slot.warden}${type ? `/${type}` : ""}`,
  ...rest,
});

const tagsOverride = (slot, tags, distinctGroupingTags) => {
  const gTags = slot.tags.filter((tag) => tags.includes(tag));

  if (gTags.length === 0) {
    throw new Error(
      "When grouping by tags, all characters must have at least 1 tag in the " +
        `"grouping" option, found "${slot.name}" has none of [${tags.join(", ")}], ` +
        `found [${slot.tags.join(", ")}]`,
    );
  }

  if (!distinctGroupingTags) {
    return [baseOverride(slot, gTags.join(","))];
  }

  return gTags.map((gTag) =>
    baseOverride(slot, gTag, {
      tags: slot.tags.filter((tag) => tag === gTag || !gTags.includes(tag)),
    }),
  );
};

export const getGroupingOverrides = (slot, grouping, distinctGroupingTags) => {
  let tags;

  if (Array.isArray(grouping)) {
    tags = grouping;
    grouping = "tags";
  }

  switch (grouping) {
    case "comp":
      return [baseOverride(slot)];
    case "tags":
      return tagsOverride(slot, tags, distinctGroupingTags);
  }
};

// a here is the slot key, b is the count of that key
const partyKeySort = (a, b) =>
  b[1] === a[1] ? b[0].localeCompare(a[0]) : b[1] - a[1];

export const getCompKey = (type, partyIdxs, pool) => {
  const prefix = Array.isArray(type) ? "tags" : type;
  const last = partyIdxs.length - 1;
  const body = partyIdxs
    .reduce((counts, idx, i) => {
      const key = pool[idx][SLOT_KEY];
      counts[key] = (counts[key] || 0) + 1;
      return i < last ? counts : Object.entries(counts);
    }, {})
    .sort(partyKeySort)
    .map(([key, count]) => `${count}:${key}`)
    .join(";");

  return `${prefix}|${body}`;
};
