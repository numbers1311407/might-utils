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
