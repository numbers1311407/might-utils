import { Warden } from "@/lib/constants";
import { getNumberedArray, cloneObject, countKeys } from "@/lib/utils";

const standardTags = [
  { value: "dps", type: "role" },
  { value: "tank", type: "role" },
  { value: "support", type: "role" },
  { value: "healer", type: "role" },
  { value: "mdps", type: "role" },
  { value: "rdps", type: "role" },
  { value: "cloth", type: "armor" },
  { value: "plate", type: "armor" },
  { value: "chain", type: "armor" },
  { value: "leather", type: "armor" },
  { value: "warden", type: "other" },
  { value: "pet", type: "other" },
  { value: "melee", type: "other" },
];

const defaultClassTags = {
  BER: ["dps", "mdps", "chain"],
  BRD: ["support", "plate", "melee"],
  BST: ["dps", "mdps", "leather", "melee", "pet"],
  CLR: ["healer", "plate"],
  DRU: ["healer", "leather"],
  ENC: ["support", "cloth"],
  MAG: ["dps", "rdps", "cloth", "pet"],
  MNK: ["dps", "mdps", "leather", "melee"],
  NEC: ["dps", "rdps", "cloth", "pet"],
  PAL: ["tank", "plate", "melee"],
  RNG: ["dps", "rdps", "chain"],
  ROG: ["dps", "mdps", "chain"],
  SHD: ["tank", "plate", "melee"],
  SHM: ["healer", "chain"],
  WAR: ["tank", "plate", "melee"],
  WIZ: ["dps", "rdps", "cloth"],
};

const defaultTagRules = {
  2: [
    { type: "name", value: "geese", warden: 2 },
    { type: "tag", value: "tank", range: 1 },
    { type: "tag", value: "healer", range: 1 },
    { type: "name", value: "phatos", warden: 0 },
  ],
  5: [
    { type: "tag", value: "healer", range: 2 },
    { type: "tag", value: "support", range: [0, 1] },
  ],
  6: [{ type: "tag", value: "dps", range: 2 }],
  9: [
    { type: "tag", value: "healer", range: [0, 1] },
    { type: "tag", value: "tank", range: 2 },
    { type: "tag", value: "dps", range: [4] },
    { type: "tag", value: "support", range: [2] },
  ],
  12: [
    { type: "tag", value: "dps", range: [5] },
    { type: "tag", value: "healer", range: 3 },
  ],
};

export const getStandardTags = () => cloneObject(standardTags);
export const getDefaultTagRules = () => cloneObject(defaultTagRules);
export const getDefaultClassTags = () => cloneObject(defaultClassTags);

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

          if (range.length === 2) {
            if (range[0] > range[1]) {
              throw (
                `Rule "${value}" for size ${size} invalid: range must be [low, high], ` +
                `found [${range.join(", ")}]`
              );
            }
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
