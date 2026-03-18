export const humanizeTag = (tag, typePrefix = false) => {
  const [type, value] = tag.split("-");
  const prefix = typePrefix
    ? {
        c: "class ",
        t: "tag ",
        l: "level ",
        n: "name ",
      }[type] || ""
    : "";

  switch (type) {
    case "c":
      return prefix + value.toUpperCase();
    case "l":
      return prefix + value;
    case "n":
      return prefix + value.replace(/^./, (l) => l.toUpperCase());
    case "t":
      return prefix + `"${value}"`;
    default:
      return prefix + value;
  }
};
