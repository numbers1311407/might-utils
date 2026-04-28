import { processComp } from "@/model/schemas/comp";
import { round as utilsRound, standardDeviation } from "@/utils";
import { getCharMight } from "@/config/chars/might";

export const getCompStatsMap = (compMap) => {
  const round = (v) => utilsRound(v, 2);

  const out = compMap.entries().reduce((map, [comp, { slots: compSlots }]) => {
    if (!compSlots?.length) {
      return map;
    }

    const stats = compSlots.reduce(
      (totals, slot, i) => {
        const baseMight = getCharMight({ level: slot.level, warden: 0 });
        const might = getCharMight(slot);

        totals.scores.push(might);

        // TODO the size is right in the comp string but it's not parsed out
        totals.size += slot.count;
        totals.level += slot.level * slot.count;
        totals.might += might * slot.count;
        totals.warden += slot.warden * slot.count;

        totals.baseMight += baseMight * slot.count;
        totals.wardenMight += (might - baseMight) * slot.count;
        totals.mightRange = [
          Math.min(might, totals.mightRange[0]),
          Math.max(might, totals.mightRange[1]),
        ];

        if (i !== compSlots.length - 1) {
          return totals;
        }

        return {
          score: totals.might,
          size: totals.size,

          levelAvg: round(totals.level / totals.size),
          levelMightPct: round((totals.baseMight / totals.might) * 100),
          levelMightTotal: totals.baseMight,
          levelTotal: totals.level,

          mightAvg: round(totals.might / totals.size),
          mightRange: totals.mightRange[1] - totals.mightRange[0],
          mightRangeBounds: totals.mightRange,
          mightSD: round(
            standardDeviation(totals.scores, { usePopulation: true }),
          ),

          wardenAvg: round(totals.warden / totals.size),
          wardenMightPct: round((totals.wardenMight / totals.might) * 100),
          wardenMightTotal: totals.wardenMight,
          wardenRankTotal: totals.warden,
        };
      },
      {
        baseMight: 0,
        size: 0,
        level: 0,
        might: 0,
        warden: 0,
        wardenMight: 0,
        mightRange: [Infinity, 0],
        scores: [],
      },
    );

    return map.set(comp, stats);
  }, new Map());

  return out;
};

// parties optionally with the help of selector should return virtual party
// objects, or at least { comp, chars }
export const getPartyCompsMap = (parties, selector) => {
  // going over each party
  return parties.reduce((acc, item) => {
    const party = typeof selector === "function" ? selector(item) : item;
    // add it to our set if it's not there, processing the comp
    // string and attaching a `slots` set we'll use to track slots
    // who fit this comp (for the UI to show a tooltip, etc)
    if (!acc.has(party.comp)) {
      const [slots, { type, count, might }] = processComp(party.comp);
      acc.set(party.comp, {
        comp: party.comp,
        count,
        might,
        type,
        slots: slots.map((slot) => ({
          ...slot,
          chars: new Set(),
        })),
      });
    }

    // get the deserialized comp we just added
    const comp = acc.get(party.comp);

    // for each party member, figure out who's matching which of the
    // warden/level/tags requirements for the comp slots, and add them
    // to a set in the comp for use in the UI.
    party.chars.forEach((slot) => {
      const compItemIdx = comp.slots.findIndex((o) => {
        // NOTE party comps have a different index lookup here,
        // becaues party comps use terms to track char names. So
        // for party comps we just match the name.
        if (comp.type === "party") {
          return o.terms.includes(slot.name);
        }
        // If it's not a party comp it's a base or tags comp, both
        // of which will rely on warden+level; base relies on these
        // only, but tag types also need it to disambiguate when chars
        // have multiple group tags (like a tank+dps mage) and may
        // have tags in multiple groups but be assigned one slot based
        // on warden/level. Base comps don't have terms so the
        // `terms.every` is always true.
        return (
          o.warden === slot.warden &&
          o.level === slot.level &&
          o.terms.every((tag) => slot.tags.includes(tag))
        );
      });

      if (compItemIdx !== -1) {
        comp.slots[compItemIdx].chars.add(slot);
      }
    });

    return acc;
  }, new Map());
};
