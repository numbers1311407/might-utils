import * as z from "zod";
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

const createCompGroup = ({ level, warden, terms }) => {
  return `${level}/${warden}${terms ? "/" + [...terms].sort().join(",") : ""}`;
};

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

  return `${type}|${body}`;
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

const processCompHeader = (compStr = "") => {
  const [header] = compStr.split("|");
  const [type] = header.split(";");
  return {
    type: type || "base",
  };
};

export const processComp = (compStr) => {
  const header = processCompHeader(compStr);
  const meta = { ...header, count: 0, might: 0 };

  if (!compStr) {
    return [[], meta];
  }

  if (!baseValid.test(compStr) && !subtermsValid.test(compStr)) {
    console.error(
      `Invalid party composition format or level/warden out of range: "${compStr}"`,
    );
    return [[], meta];
  }

  const extractRegex =
    /(\d+):(4[5-9]|[56][0-9]|7[01])\/([0-3])(?:\/([a-zA-Z0-9\-,]+))?/g;

  const comp = [...compStr.matchAll(extractRegex)].map((match) => {
    const [_, _count, _level, _warden, terms] = match;
    const count = Number(_count);
    const level = Number(_level);
    const warden = Number(_warden);
    const might = getCharMight({ level, warden });

    meta.count += count;
    meta.might += might * count;

    return {
      count,
      level,
      warden,
      might,
      terms: terms?.length ? terms.split(",") : [],
    };
  });

  return [comp, meta];
};

export const processPartyComp = (value) => {
  const compSlots = typeof value === "string" ? processComp(value)[0] : value;

  return (compSlots || [])
    .reduce((party, group) => {
      const { terms, count: _c, ...rest } = group;
      terms.forEach((name) => party.push({ name, ...rest }));
      return party;
    }, [])
    .sort((a, b) => {
      return a.name.localeCompare(b.name);
    });
};

export const getCompMight = (value) => {
  return processComp(value)[1]?.might || 0;
};
