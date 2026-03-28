import instanceData from "@/assets/instance-data.csv";
import { INSTANCE_MEDALS, INSTANCE_TYPES } from "./constants.js";

export const parseInstanceData = (data, type = "group") => {
  const parsed = [...INSTANCE_MEDALS].reduce(
    (acc, medal) => ({
      ...acc,
      [medal]: {},
    }),
    {},
  );

  data.forEach((row) => {
    if (row.type !== type) return;

    const partyMight = Number(row.partyMight);
    const suggestedMight = Number(row.suggestedMight);
    const ratio = partyMight / suggestedMight;

    const slots = [...INSTANCE_MEDALS].map((medal) => ({
      name: medal,
      value: row[medal],
    }));

    slots.forEach((slot) => {
      if (!slot.value || slot.value === "-") return;

      const [diff, aura] = slot.value.split(":");
      const medal = parsed[slot.name];

      medal[diff] ||= {};

      if (!medal[diff][aura]) {
        medal[diff][aura] = { min: ratio, max: ratio };
      } else {
        const { min, max } = medal[diff][aura];

        medal[diff][aura].min = Math.min(min, ratio);
        medal[diff][aura].max = Math.max(max, ratio);
      }
    });
  });

  return parsed;
};

const data = {};

for (const type of INSTANCE_TYPES) {
  data[type] = parseInstanceData(instanceData, type);
}

export default data;
