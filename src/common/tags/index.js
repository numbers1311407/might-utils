import { Warden } from "@/common/warden";
import { getNumberedArray, countKeys } from "@/utils";
import { defaultClassTags } from "./defaults.js";

export * from "./defaults.js";

export const formatTag = (value, options = {}) => {
  const prefix =
    { name: "n-", class: "c-", group: "g-", level: "l-" }[options.type] || "t-";
  const suffix =
    { true: "+", 0: "+0", 1: "+1", 2: "+2", 3: "+3" }[options.warden] || "";
  return `${prefix}${String(value).toLowerCase()}${suffix}`;
};
export const t = formatTag;

export const prepareTagRules = (maxSize, ruleSet) => {
  return getNumberedArray(maxSize).reduce(
    (acc, size) => {
      const rules = ruleSet[size];
      // if we have new rules prepare them and replace the curren tset built for
      // the previous threshold
      if (rules) {
        acc.current = { ...(acc.current || {}) };

        for (const rule of rules) {
          const { type, warden, value: v, range: r } = rule;
          const range =
            type === "name" ? [1, 1] : Array.isArray(r) ? r : [r, r];
          const value = t(v, { type, warden });

          if (range.length === 2 && range[0] > range[1]) {
            throw (
              `Rule "${value}" for size ${size} invalid: range must be [low, high], ` +
              `found [${range.join(", ")}]`
            );
          }

          acc.current[value] = range;
        }
      }
      acc.map[size] = acc.current;
      return acc;
    },
    {
      map: [],
      current: undefined,
    },
  ).map;
};

export const validateTagCounts = (counts = {}, rules = {}) => {
  for (const tag in rules) {
    const range = rules[tag];
    const count = counts[tag] || 0;

    if (count < range[0] || (range[1] !== undefined && count > range[1])) {
      return false;
    }
  }
  return true;
};

export const generateTagCounts = (lineup) => {
  const counts = {};
  for (const slot of lineup) {
    countKeys(slot.tags, counts);
  }
  return counts;
};

const validWardenRanks = Warden.Ranks.map(({ rank }) => rank);
export const generateCharacterTags = (char, options = {}) => {
  const {
    warden = char.warden,
    classTags = defaultClassTags,
    tagGroups,
  } = options;

  const tags = [
    t(char.name, { type: "name" }),
    t(char.level, { type: "level" }),
    t(char.class, { type: "class" }),
    ...(classTags[char.class] || []).map(t),
    ...(char.tags || []).map(t),
  ];

  if (warden !== undefined) {
    if (isNaN(warden) || !validWardenRanks.includes(Number(warden))) {
      throw `For tag generation warden must be the numeric rank, got "${warden}"`;
    }

    // if warden is not 0 push "any warden" tags
    if (warden !== 0) {
      tags.push(
        ...[
          t(char.class, { type: "class", warden: true }),
          t(char.name, { type: "name", warden: true }),
          t(char.level, { type: "level", warden: true }),
        ],
      );
    }

    tags.push(
      ...[
        t(char.class, { type: "class", warden }),
        t(char.name, { type: "name", warden }),
        t(char.level, { type: "level", warden }),
      ],
    );
  }

  if (tagGroups?.length) {
    tags.push(getGroupTag(tagGroups, char, tags, { warden }));
  }

  return new Set(tags.sort());
};

export const getGroupTag = (tagGroups, char, tags, options = {}) => {
  const { warden = char.warden } = options;
  const assigned = tagGroups.filter((tag) => tags.includes(tag));
  const groupTag = assigned[0];
  const len = assigned.length;
  if (len !== 1) {
    throw (
      `Tag grouping requires exactly 1 of each tag to be present on every character. ${char.name} ` +
      (len > 1
        ? `has ${len} of tags [${tagGroups.join(", ")}], found [${assigned.join(", ")}].`
        : `has 0 of [${tagGroups.join(", ")}].`)
    );
  }
  return t(`${groupTag}:${char.level}`, { warden, type: "group" });
};

const acronyms = new Set(["dps", "rdps", "mdps"]);

export const humanizeTag = (tag) => {
  const [type, value] = tag.split("-");

  switch (type) {
    case "c":
      return value.toUpperCase();
    case "t":
    case "l":
    default:
      return acronyms.has(value)
        ? value.toUpperCase()
        : value.replace(/^./, (l) => l.toUpperCase());
  }
};
