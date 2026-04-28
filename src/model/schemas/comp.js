import * as z from "zod";
import { sum } from "@/utils";
import { getCharMight } from "@/config/chars";

// NOTE all these regexes assume the lowest level is 45 and highest is 71
const baseValid =
  /^[^|]+\|\d+:(4[5-9]|[56][0-9]|7[01])\/[0-3](?:;\d+:(4[5-9]|[56][0-9]|7[01])\/[0-3])*$/;
const subtermsValid =
  /^[^|]+\|\d+:(4[5-9]|[56][0-9]|7[01])\/[0-3]\/[a-zA-Z0-9-]+(?:,[a-zA-Z0-9-]+)*(?:;\d+:(4[5-9]|[56][0-9]|7[01])\/[0-3]\/[a-zA-Z0-9-]+(?:,[a-zA-Z0-9-]+)*)*$/;

export const compSchema = z.union([
  z.string().regex(baseValid),
  z.string().regex(subtermsValid),
]);

const groupCountSort = (a, b) =>
  b[1] === a[1] ? b[0].localeCompare(a[0]) : b[1] - a[1];

// items here expected to have warden+level and terms predefined
export const createComp = (items, type = "base") => {
  if (!items.length) {
    return undefined;
  }

  const counts = items.reduce((acc, item) => {
    const group = createCompGroup(item);
    acc[group] = (acc[group] || 0) + 1;
    return acc;
  }, {});

  const body = Object.entries(counts)
    .sort(groupCountSort)
    .map(([group, count]) => `${count}:${group}`)
    .join(";");

  return `${type};${items.length}|${body}`;
};

export const createTagsComp = (chars, tags) => {
  const groupTagSet = new Set(tags);
  const buckets = chars.reduce((acc, { level, warden, tags }) => {
    const terms = Array.from(groupTagSet.intersection(new Set(tags))).sort();
    if (!terms.length) {
      throw new Error(
        "when creating a tags comp all chars must have at least 1 given tag",
      );
    }
    const group = createCompGroup({ level, warden, terms });
    if (!acc[group]) {
      acc[group] = [];
    }
    acc[group].push({ level, warden, terms });
    return acc;
  }, {});

  return createComp(Object.values(buckets).flat(), "tags");
};

export const createPartyComp = (chars) => {
  const buckets = chars.reduce((acc, { name, warden, level }) => {
    const group = createCompGroup({ warden, level });
    if (!acc[group]) {
      acc[group] = [{ level, warden, terms: [name] }];
    } else {
      acc[group].forEach((grp) => {
        grp.terms = [...grp.terms, name];
      });
      acc[group].push({ ...acc[group][0] });
    }
    return acc;
  }, {});

  return createComp(Object.values(buckets).flat(), "party");
};

export const createCompGroup = ({ level, warden, terms }) => {
  return `${level}/${warden}${terms ? "/" + [...terms].sort().join(",") : ""}`;
};

export const humanizeComp = (comp) => {
  return comp
    .map((item) => {
      return (
        `${item.count} ${item.level}${item.warden ? ` Rk. ${item.warden}` : ""} ` +
        `${item.terms.length ? `"${item.terms.join('", "')}"` : ""}`
      );
    })
    .join(", ");
};

export const processCompHeader = (compStr = "") => {
  const [header] = compStr.split("|");
  const [type, count] = header.split(";");
  return {
    type: type ?? "base",
    count: count ? Number(count) : 0,
  };
};

export const processComp = (compStr) => {
  const header = processCompHeader(compStr);

  if (!compStr) {
    return [[], header];
  }

  if (!baseValid.test(compStr) && !subtermsValid.test(compStr)) {
    console.error(
      `Invalid party composition format or level/warden out of range: "${compStr}"`,
    );
    return [[], header];
  }

  const extractRegex =
    /(\d+):(4[5-9]|[56][0-9]|7[01])\/([0-3])(?:\/([a-zA-Z0-9\-,]+))?/g;

  const comp = [...compStr.matchAll(extractRegex)].map((match) => {
    const [_, count, level, warden, terms] = match;

    return {
      count: Number(count),
      level: Number(level),
      warden: Number(warden),
      terms: terms?.length ? terms.split(",") : [],
    };
  });

  return [comp, header];
};

export const processPartyComp = (compStr) => {
  return processComp(compStr)[0]
    .reduce((party, group) => {
      const { terms, count: _c, ...rest } = group;
      terms.forEach((name) => party.push({ name, ...rest }));
      return party;
    }, [])
    .sort((a, b) => {
      return a.name.localeCompare(b.name);
    });
};

export const getMightFromPartyComp = (comp) => {
  return comp
    ? sum(processPartyComp(comp).map((slot) => getCharMight(slot)))
    : 0;
};
