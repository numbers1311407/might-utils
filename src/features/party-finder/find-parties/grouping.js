const SLOT_KEY = "groupKey";

const singleKey = (value, slot) => ({
  [SLOT_KEY]: `${value}/${slot.level}/${slot.warden}`,
});

const tagsKey = (slot, tags, distinctGroupingTags) => {
  const gTags = slot.tags.filter((tag) => tags.includes(tag));

  if (gTags.length === 0) {
    throw new Error(
      "When grouping by tags, all characters must have at least 1 tag in the " +
        `"grouping" option, found "${slot.name}" has none of [${tags.join(", ")}], ` +
        `found [${slot.tags.join(", ")}]`,
    );
  }

  if (!distinctGroupingTags) {
    return [singleKey(gTags.join(","), slot)];
  }

  return gTags.map((gTag) =>
    Object.assign(singleKey(gTag, slot), {
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
    case "level":
      return [singleKey(slot.level, slot)];
    case "class":
      return [singleKey(slot.class, slot)];
    case "warden":
      return [singleKey(slot.warden, slot)];
    case "tags":
      return tagsKey(slot, tags, distinctGroupingTags);
  }
};

export const getTagGroupKey = (grouping, partyIdxs, pool) => {
  const sort =
    grouping === "class"
      ? (a, b) => a.localeCompare(b)
      : (a, b) => b.localeCompare(a);
  const prefix = Array.isArray(grouping) ? "tags" : grouping;
  const last = partyIdxs.length - 1;
  const body = partyIdxs
    .reduce((counts, id, i) => {
      const key = pool[id][SLOT_KEY];
      counts[key] = (counts[key] || 0) + 1;
      return i < last ? counts : Object.entries(counts);
    }, {})
    .sort((a, b) => (b[1] === a[1] ? sort(a[0], b[0]) : b[1] - a[1]))
    .map(([key, count]) => `${count}:${key}`)
    .join(";");

  return `${prefix}|${body}`;
};
