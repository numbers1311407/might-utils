import { getNumberedArray, countKeys } from "@/utils";
import { Warden } from "@/core/config/warden";
import { defaultClassTags } from "@/core/config/defaults";

export * from "./humanize-tag.js";

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
          const value = t(v, { type, warden });
          const throwInvalid = (v) => {
            throw (
              `Rule "${value}" for size ${size} invalid: range must be [min], [min, max], or * ` +
              `found ${v}`
            );
          };

          let range;

          // name type rules must be exactly 1 for obvious reasons
          if (type === "name") {
            range = [1, 1];

            // keep special * rule as is
          } else if (r === "*") {
            range = r;

            // if range a single number shorthand replace it with a min/max array
          } else if (typeof r === "number") {
            range = [r, r];

            // keep predefined arrays as written but do minimal validation
          } else if (
            Array.isArray(r) &&
            r.every((v) => typeof v === "number")
          ) {
            if (r.length > 2 || (r.length === 2 && r[0] > r[1])) {
              throwInvalid(`[${range.join(", ")}]`);
            }
            range = r;

            // finally throw on whatever didn't match
          } else {
            throwInvalid(r);
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

export const validateTagCounts = (counts, rules, size) => {
  for (const tag in rules) {
    // The special * rule transforms into the exact size of the lineup. This is intended
    // for setups like tagging based on keys/flagging where you want to ensure each character
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
