import { getNumberedArray, countKeys } from "@/utils";
import { Warden } from "@/core/config/warden";
import { parseTagRuleWarden, parseTagRuleRange } from "@/core/schemas";
import {
  ALL_RANGE_LITERAL,
  GROUP_TAG_DELIMITER,
  GROUP_TAG_KEY_DELIMITER,
  MULTI_GROUP_TAG_DELIMITER,
  TYPE_DELIMITER,
  TYPE_PREFIX_CLASS,
  TYPE_PREFIX_GROUP,
  TYPE_PREFIX_LEVEL,
  TYPE_PREFIX_NAME,
  TYPE_PREFIX_TAG,
  WARDEN_DELIMITER,
} from "./constants.js";

export const formatTag = (value, options = {}) => {
  const prefix =
    ({
      name: TYPE_PREFIX_NAME,
      class: TYPE_PREFIX_CLASS,
      group: TYPE_PREFIX_GROUP,
      level: TYPE_PREFIX_LEVEL,
    }[options.type] || TYPE_PREFIX_TAG) + TYPE_DELIMITER;

  const wardenSuffixEnds = {
    true: "",
    0: "0",
    1: "1",
    2: "2",
    3: "3",
  };
  const suffix =
    options.warden in wardenSuffixEnds
      ? WARDEN_DELIMITER + wardenSuffixEnds[options.warden]
      : "";

  return `${prefix}${String(value).toLowerCase()}${suffix}`;
};
export const t = formatTag;

export const prepareTagRules = (rules) => {
  return [...rules].reduce((acc, rule) => {
    for (const size of getNumberedArray(rule.size[0], rule.size[1])) {
      acc[size] ||= {};
      const { type, warden: w, value: v, range: r } = rule;
      const value = t(v, { type, warden: parseTagRuleWarden(w) });
      // if type is name just ignore the range, it must be [1, 1]
      acc[size][value] = type === "name" ? [1, 1] : parseTagRuleRange(r);
    }
    return acc;
  }, {});
};

export const validateTagCounts = (counts, rules, size) => {
  for (const tag in rules) {
    // The special * rule transforms into the exact size of the lineup. This
    // is intended for setups like tagging based on keys/flags where you want
    // to ensure each character is eligible to do the instance.
    const range = rules[tag] === ALL_RANGE_LITERAL ? [size, size] : rules[tag];
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
  const { warden = char.warden, classTags, tagGroups } = options;

  const ntags = [...(classTags?.[char.class] || []), ...(char.tags || [])];

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
  const { warden = char.warden, multi = true } = options;
  const assigned = tagGroups.filter((tag) => tags.includes(tag));
  const len = assigned.length;
  if (!multi && len !== 1) {
    throw (
      `Tag grouping requires exactly 1 of each tag to be present on every character. ${char.name} ` +
      (len > 1
        ? `has ${len} of tags [${tagGroups.join(", ")}], found [${assigned.join(", ")}].`
        : `has 0 of [${tagGroups.join(", ")}].`)
    );
  }

  // this is a little awkward but in grouping, all tags are the same type and here we're
  // effectively merging the tags and relying on the initial type prefix. This just makes
  // the tag a little more straightforward to parse later.
  const tag = assigned
    .sort()
    .map((t, i) => {
      return i === 0 ? t : t.split(TYPE_DELIMITER)[1];
    })
    .join(MULTI_GROUP_TAG_DELIMITER);

  return t(`${tag}:${char.level}`, {
    warden,
    type: "group",
  });
};

export const getTagGroupKey = (tagCounts) => {
  const prefix = TYPE_PREFIX_GROUP + TYPE_DELIMITER;
  return Object.entries(tagCounts)
    .filter(([tag]) => tag.startsWith(prefix))
    .map(([tag, count]) =>
      [tag.replace(prefix, ""), count].join(GROUP_TAG_DELIMITER),
    )
    .sort()
    .join(GROUP_TAG_KEY_DELIMITER);
};
