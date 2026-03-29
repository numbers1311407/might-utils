import {
  TYPE_DELIMITER,
  WARDEN_DELIMITER,
  TYPE_PREFIX_NAME,
  TYPE_PREFIX_LEVEL,
  TYPE_PREFIX_TAG,
  TYPE_PREFIX_WARDEN,
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
        [TYPE_PREFIX_WARDEN]: "warden ",
      }[type] || ""
    : "";

  const [value, warden] = rest.split(WARDEN_DELIMITER);
  const suffix =
    warden !== undefined ? (warden === "" ? " rk. 1+" : ` rk. ${warden}`) : "";

  switch (type) {
    case TYPE_PREFIX_CLASS:
      return prefix + value.toUpperCase() + suffix;
    case TYPE_PREFIX_LEVEL:
      return prefix + value + suffix;
    case TYPE_PREFIX_NAME:
      return prefix + value.replace(/^./, (l) => l.toUpperCase()) + suffix;
    case TYPE_PREFIX_TAG:
      return prefix + `"${value}"` + suffix;
    case TYPE_PREFIX_WARDEN:
      return prefix + (warden === "" ? " rk. 1+" : ` rk. ${warden}`);
    default:
      return prefix + value + suffix;
  }
};

// TODO "warden" and "level" grouping break this whole idea so it'll need to be
// revisited, but it may just be removed/changed with the final results UI.
export const humanizeGroupTag = (groupTag) => {
  let counts = 0;

  const body = groupTag
    .split(GROUP_TAG_KEY_DELIMITER)
    .map((t) => {
      const [tag, levelr, count] = t.split(GROUP_TAG_DELIMITER);
      counts += Number(count);
      const [level, rank] = levelr.split(WARDEN_DELIMITER);
      return `${count}x${humanizeTag(tag)}${rank === "0" ? "" : `r${rank}`}`;
    })
    .join(", ");

  return `${counts} chars: ${body}`;
};
