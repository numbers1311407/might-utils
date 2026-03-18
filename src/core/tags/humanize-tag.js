export const humanizeTag = (tag, typePrefix = false) => {
  const [type, rest] = tag.split("-");
  const prefix = typePrefix
    ? {
        c: "class ",
        t: "tag ",
        l: "level ",
        n: "named ",
      }[type] || ""
    : "";

  const [value, warden] = rest.split("+");
  const suffix =
    warden !== undefined
      ? warden === ""
        ? ", warden > 0"
        : `, warden ${warden}`
      : "";

  switch (type) {
    case "c":
      return prefix + value.toUpperCase() + suffix;
    case "l":
      return prefix + value + suffix;
    case "n":
      return prefix + value.replace(/^./, (l) => l.toUpperCase()) + suffix;
    case "t":
      return prefix + `"${value}"` + suffix;
    default:
      return prefix + value + suffix;
  }
};
