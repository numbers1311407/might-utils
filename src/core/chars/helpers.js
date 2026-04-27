import { processComp } from "@/model/schemas/comp";
import { round as utilsRound, standardDeviation } from "@/utils";

export const getCompStatsMap = (compMap) => {
  const round = (v) => utilsRound(v, 2);

  return compMap.entries().reduce((map, [comp, compSlots]) => {
    if (!compSlots?.length) {
      return new Map();
    }

    const stats = compSlots.reduce(
      (totals, slot, i) => {
        totals.scores.push(slot.might);

        // TODO the size is right in the comp string but it's not parsed out
        totals.size += slot.count;
        totals.level += slot.level * slot.count;
        totals.might += slot.might * slot.count;
        totals.warden += slot.warden * slot.count;

        totals.baseMight += slot.baseMight * slot.count;
        totals.wardenMight += (slot.might - slot.baseMight) * slot.count;
        totals.mightRange = [
          Math.min(slot.might, totals.mightRange[0]),
          Math.max(slot.might, totals.mightRange[1]),
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
      acc.set(
        party.comp,
        processComp(party.comp).map((compSlot) => ({
          ...compSlot,
          slots: new Set(),
        })),
      );
    }

    // get the deserialized comp we just added
    const compSlots = acc.get(party.comp);

    // for each party member, figure out who's matching which of the
    // warden/level/tags requirements for the comp slots, and add them
    // to a set in the comp for use in the UI.
    party.chars.forEach((slot) => {
      const compItemIdx = compSlots.findIndex((o) => {
        return (
          o.warden === slot.warden &&
          o.level === slot.level &&
          o.terms.every((tag) => slot.tags.includes(tag))
        );
      });
      if (compItemIdx !== -1) {
        compSlots[compItemIdx].slots.add(slot);
      }
    });

    return acc;
  }, new Map());
};
