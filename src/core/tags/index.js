import { getNumberedArray, countKeys } from "@/utils";
import { Warden } from "@/core/config/warden";
import { defaultClassTags } from "@/core/config/defaults";
import { parseTagRuleWarden, parseTagRuleRange } from "@/core/schemas";

export * from "./humanize-tag.js";

export const formatTag = (value, options = {}) => {
  const prefix =
    { name: "n-", class: "c-", group: "g-", level: "l-" }[options.type] || "t-";
  const suffix =
    { true: "+", 0: "+0", 1: "+1", 2: "+2", 3: "+3" }[options.warden] || "";
  return `${prefix}${String(value).toLowerCase()}${suffix}`;
};
export const t = formatTag;

export const prepareTagRules = (maxSize, ruleset) => {
  return getNumberedArray(maxSize).reduce(
    (acc, size) => {
      const rules = ruleset[size];
      // if we have new rules prepare them and replace the current set built for the
      // previous threshold, this will be assigned to all sizes until the next set
      // is generated.
      if (rules) {
        acc.current = { ...(acc.current || {}) };

        // for each rule, generate a corresponding tag and parse the range value from
        // the stored string into a range expected by the algorithm.
        for (const rule of rules) {
          const { type, warden: w, value: v, range: r } = rule;
          const value = t(v, { type, warden: parseTagRuleWarden(w) });
          // NOTE just forcing [1, 1] here for name rules since it must be so, though
          // technically the rule *should* be "1", there's no reason to parse it.
          acc.current[value] = type === "name" ? [1, 1] : parseTagRuleRange(r);
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

export const validateTagCounts = (counts, rules, size) => {
  for (const tag in rules) {
    // The special * rule transforms into the exact size of the lineup. This is intended
    // for setups like tagging based on keys/flags where you want to ensure each character
    // is eligible to do the instance.
    const range = rules[tag] === "*" ? [size, size] : rules[tag];
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

  const ntags = [...(classTags[char.class] || []), ...(char.tags || [])];

  const tags = [
    t(char.name, { type: "name" }),
    t(char.level, { type: "level" }),
    t(char.class, { type: "class" }),
    ...ntags.map(t),
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
          ...ntags.map((tag) => t(tag, { warden: true })),
        ],
      );
    }

    tags.push(
      ...[
        t(char.class, { type: "class", warden }),
        t(char.name, { type: "name", warden }),
        t(char.level, { type: "level", warden }),
        ...ntags.map((tag) => t(tag, { warden })),
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
