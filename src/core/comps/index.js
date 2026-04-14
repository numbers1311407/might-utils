const SLOT_KEY = "comp";

const baseExtend = (slot, tags, rest = {}) => ({
  [SLOT_KEY]: `${slot.level}/${slot.warden}${tags ? `/${tags}` : ""}`,
  ...rest,
});

const tagsExtend = (slot, tags, distinctGroupingTags) => {
  const gTags = slot.tags.filter((tag) => tags.includes(tag));

  if (gTags.length === 0) {
    throw new Error(
      "When grouping by tags, all characters must have at least 1 tag in the " +
        `"grouping" option, found "${slot.name}" has none of [${tags.join(", ")}], ` +
        `found [${slot.tags.join(", ")}]`,
    );
  }

  if (!distinctGroupingTags) {
    return [baseExtend(slot, gTags.join(","))];
  }

  return gTags.map((gTag) =>
    baseExtend(slot, gTag, {
      tags: slot.tags.filter((tag) => tag === gTag || !gTags.includes(tag)),
    }),
  );
};

const getExtendedSlots = (slot, type, distinctGroupingTags) => {
  let tags;

  if (Array.isArray(type)) {
    tags = type;
    type = "tags";
  }

  switch (type) {
    case "comp":
      return [baseExtend(slot)];
    case "tags":
      return tagsExtend(slot, tags, distinctGroupingTags);
  }
};

// a here is the slot key, b is the count of that key
const partyKeySort = (a, b) =>
  b[1] === a[1] ? b[0].localeCompare(a[0]) : b[1] - a[1];

const getPartyKey = (type, partyIdxs, pool) => {
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

const hWarden = (rank) => (rank === "0" ? "Unwardened" : `Rank ${rank}`);

const typeFn = (type) => {
  const comp = (_, level, warden) => `${hWarden(warden)} ${level}`;
  return (
    {
      comp,
      tags: (tags, level, warden) =>
        `${hWarden(warden)} ${level} tagged: "${tags.split(",").join('" and "')}"`,
    }[type] || comp
  );
};

const humanizePartyKey = (key) => {
  const [type, rest] = key.split("|");
  const tuples = rest.split(";");
  const t = typeFn(type);

  return tuples.map((tuple) => {
    const [count, fullKey] = tuple.split(":");
    const [level, warden, type] = fullKey.split("/");
    return `${count} ${t(type, level, warden)}`;
  });
};

export { getPartyKey, getExtendedSlots, humanizePartyKey };
