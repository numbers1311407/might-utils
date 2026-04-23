import { parse } from "csv-parse/sync";
import { initDict } from "../src/utils";
import {
  INSTANCE_MEDALS,
  INSTANCE_TYPES,
} from "../src/core/calculators/calculator-constants.js";

export const parseInstanceData = () => ({
  name: "parse-instance-data",
  transform(code, id) {
    if (
      !id.endsWith(".csv") &&
      !id.endsWith(".csv?tiers") &&
      !id.endsWith(".csv?csv")
    ) {
      return;
    }

    let parser;

    if (id.endsWith(".csv")) {
      parser = parseTypes;
    } else if (id.endsWith("?tiers")) {
      parser = parseTierData;
    } else {
      parser = (csv) => csv;
    }

    const csv = parse(code, { columns: true });

    return {
      code: `export default ${JSON.stringify(parser(csv))}`,
      map: null,
    };
  },
});

const parseTierData = (csv) => {
  const data = {};

  csv.forEach((row) => {
    data[row.type] ||= {};
    data[row.type][row.tier] = row.suggestedMight;
  });

  return data;
};

const parseTypes = (csv) => {
  const data = {};
  for (const type of INSTANCE_TYPES) {
    data[type] = parseType(csv, type);
  }
  return data;
};

const parseType = (data, type) => {
  // step 1: collect raw bounds for each medal
  const rawBounds = initDict(INSTANCE_MEDALS, {});

  data.forEach((row) => {
    if (row.type !== type) return;

    const partyMight = Number(row.partyMight);
    const suggestedMight = Number(row.suggestedMight);
    const ratio = partyMight / suggestedMight;

    INSTANCE_MEDALS.forEach((medal) => {
      let val = row[medal];

      if (!val) return;

      // if blank, namespace the key with the ratio to preserve order then let
      // it continue. this prrevents blanks from messing with the sorting in the
      // interpolation below. we'll throw them out in that step.
      if (val === "-") val = `BLANK_${ratio}`;

      rawBounds[medal][val] ||= { min: ratio, max: ratio };
      rawBounds[medal][val].min = Math.min(rawBounds[medal][val].min, ratio);
      rawBounds[medal][val].max = Math.max(rawBounds[medal][val].max, ratio);
    });
  });

  // step 2 interpolate midpoints and rebuild
  const parsed = initDict(INSTANCE_MEDALS, {});

  INSTANCE_MEDALS.forEach((medal) => {
    const list = Object.entries(rawBounds[medal]).map(([valStr, bounds]) => {
      const [diff, aura] = valStr.split(":");
      return { diff, aura, min: bounds.min, max: bounds.max };
    });

    // sort ascending by min ratio
    list.sort((a, b) => a.min - b.min);

    // interpolate midpoints to close the gaps
    for (let i = 0; i < list.length - 1; i++) {
      const current = list[i];
      const next = list[i + 1];
      const midpoint = (current.max + next.min) / 2;
      current.max = midpoint;
      next.min = midpoint;
    }

    // safety buffer for the edges
    if (list.length > 0) {
      list[0].min = Math.max(0, list[0].min - 0.05);
      list[list.length - 1].max = list[list.length - 1].max + 0.05;
    }

    // rebuild the structure
    list.forEach((item) => {
      if (item.diff.startsWith("BLANK")) return;

      parsed[medal][item.diff] ||= {};
      parsed[medal][item.diff][item.aura] = { min: item.min, max: item.max };
    });
  });

  return parsed;
};
