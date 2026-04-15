import * as z from "zod";

// NOTE all these regexes assume the lowest level is 45 and highest is 71
const baseValid =
  /^[^|]+\|\d+:(4[5-9]|[56][0-9]|7[01])\/[0-3](?:;\d+:(4[5-9]|[56][0-9]|7[01])\/[0-3])*$/;
const subtermsValid =
  /^[^|]+\|\d+:(4[5-9]|[56][0-9]|7[01])\/[0-3]\/[a-zA-Z0-9-]+(?:,[a-zA-Z0-9-]+)*(?:;\d+:(4[5-9]|[56][0-9]|7[01])\/[0-3]\/[a-zA-Z0-9-]+(?:,[a-zA-Z0-9-]+)*)*$/;

export const compSchema = z.union([
  z.string().regex(baseValid),
  z.string().regex(subtermsValid),
]);

const groupCountSort = (a, b) =>
  b[1] === a[1] ? b[0].localeCompare(a[0]) : b[1] - a[1];

// items here expected to have warden+level and terms predefined
export const createComp = (items, type = "base") => {
  const counts = items.reduce((acc, item) => {
    const group = createCompGroup(item);
    acc[group] = (acc[group] || 0) + 1;
    return acc;
  }, {});

  const body = Object.entries(counts)
    .sort(groupCountSort)
    .map(([group, count]) => `${count}:${group}`)
    .join(";");

  return `${type};${items.length}|${body}`;
};

export const createTagsComp = (chars, tags) => {
  const groupTagSet = new Set(tags);
  const buckets = chars.reduce((acc, { level, warden, tags }) => {
    const terms = Array.from(groupTagSet.intersection(new Set(tags))).sort();
    if (!terms.length) {
      throw new Error(
        "when creating a tags comp all chars must have at least 1 given tag",
      );
    }
    const group = createCompGroup({ level, warden, terms });
    if (!acc[group]) {
      acc[group] = [];
    }
    acc[group].push({ level, warden, terms });
    return acc;
  }, {});

  return createComp(Object.values(buckets).flat(), "tags");
};

export const createPartyComp = (chars) => {
  const buckets = chars.reduce((acc, { name, warden, level }) => {
    const group = createCompGroup({ warden, level });
    if (!acc[group]) {
      acc[group] = { level, warden, terms: [] };
    }
    acc[group].terms.push(name);
    return acc;
  }, {});

  return createComp(Object.values(buckets), "party");
};

export const createCompGroup = ({ level, warden, terms }) => {
  return `${level}/${warden}${terms ? "/" + [...terms].sort().join(",") : ""}`;
};

export const processComp = (input) => {
  if (!baseValid.test(input) && !subtermsValid.test(input)) {
    throw new Error(
      "Invalid party composition format or level/warden out of range.",
    );
  }

  const extractRegex =
    /(\d+):(4[5-9]|[56][0-9]|7[01])\/([0-3])(?:\/([a-zA-Z0-9\-,]+))?/g;

  return [...input.matchAll(extractRegex)].map((match) => {
    const [_, count, level, warden, subTerms] = match;

    return {
      count: Number(count),
      level: Number(level),
      warden: Number(warden),
      terms: subTerms ? subTerms.split(",") : [],
    };
  });
};
