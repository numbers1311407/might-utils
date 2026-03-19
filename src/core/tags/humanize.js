import {
  TYPE_DELIMITER,
  WARDEN_DELIMITER,
  TYPE_PREFIX_NAME,
  TYPE_PREFIX_LEVEL,
  TYPE_PREFIX_TAG,
  GROUP_TAG_KEY_DELIMITER,
  GROUP_TAG_DELIMITER,
  TYPE_PREFIX_CLASS,
} from "./constants.js";

export const humanizeTag = (tag, typePrefix = false) => {
  const [type, rest] = tag.split(TYPE_DELIMITER);
  const prefix = typePrefix
    ? {
        [TYPE_PREFIX_CLASS]: "class ",
        [TYPE_PREFIX_TAG]: "tag ",
        [TYPE_PREFIX_LEVEL]: "level ",
        [TYPE_PREFIX_NAME]: "named ",
      }[type] || ""
    : "";

  const [value, warden] = rest.split(WARDEN_DELIMITER);
  const suffix =
    warden !== undefined
      ? warden === ""
        ? ", warden > 0"
        : `, warden ${warden}`
      : "";

  switch (type) {
    case TYPE_PREFIX_CLASS:
      return prefix + value.toUpperCase() + suffix;
    case TYPE_PREFIX_LEVEL:
      return prefix + value + suffix;
    case TYPE_PREFIX_NAME:
      return prefix + value.replace(/^./, (l) => l.toUpperCase()) + suffix;
    case TYPE_PREFIX_TAG:
      return prefix + `"${value}"` + suffix;
    default:
      return prefix + value + suffix;
  }
};

export const humanizeGroupTag = (groupTag) => {
  return groupTag
    .split(GROUP_TAG_KEY_DELIMITER)
    .map((t) => {
      const [tag, levelr, count] = t.split(GROUP_TAG_DELIMITER);
      const [level, rank] = levelr.split(WARDEN_DELIMITER);
      const isLevelTag = tag.startsWith(TYPE_PREFIX_LEVEL + TYPE_DELIMITER);
      return `${count} ${isLevelTag ? "Level" : humanizeTag(tag)} ${level}${rank === "0" ? "" : `rk${rank}`}`;
    })
    .join(", ");
};
