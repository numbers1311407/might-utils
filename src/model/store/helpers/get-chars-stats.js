import { round } from "@/utils";
import { getCharMight } from "@/config/chars";

export const getCharsStats = (chars = []) => {
  const acc = {
    size: chars.length,
    might: {
      avg: 0,
      min: 0,
      max: 0,
      total: 0,
      minTotal: 0,
      chars: {},
      counts: {},
    },
    level: { avg: 0, min: 0, max: 0, total: 0, chars: {}, counts: {} },
    warden: { avg: 0, min: 0, max: 0, total: 0, chars: {}, counts: {} },
    class: { chars: {}, counts: {} },
    tags: { count: 0, chars: {}, counts: {} },
  };

  const t = (char) => ({ id: char.id, name: char.name });
  const counts = (chars) =>
    Object.entries(chars).reduce(
      (counts, [v, t]) => (counts[v] = t.length) && counts,
      {},
    );

  return chars.reduce((acc, char, i) => {
    // level
    acc.level.total += char.level;
    acc.level.min = Math.min(char.level, acc.level.min || char.level);
    acc.level.max = Math.max(char.level, acc.level.max);
    acc.level.chars[char.level] ||= [];
    acc.level.chars[char.level].push(t(char));

    // warden
    acc.warden.total += char.warden;
    acc.warden.min = Math.min(char.warden, acc.warden.min);
    acc.warden.max = Math.max(char.warden, acc.warden.max);
    acc.warden.chars[char.warden] ||= [];
    acc.warden.chars[char.warden].push(t(char));

    // might
    const might = getCharMight(char);
    acc.might.total += might;
    acc.might.minTotal += getCharMight(char, 0);
    acc.might.min = Math.min(might, acc.might.min || might);
    acc.might.max = Math.max(might, acc.might.max);
    acc.might.chars[might] ||= [];
    acc.might.chars[might].push(t(char));

    // class
    acc.class.chars[char.class] ||= [];
    acc.class.chars[char.class].push(t(char));

    // tags
    acc.tags.count += char.tags.length;
    for (const tag of char.tags) {
      acc.tags.chars[tag] ||= [];
      acc.tags.chars[tag].push(t(char));
    }

    if (i < chars.length - 1) {
      return acc;
    }

    acc.might.avg = round(acc.might.total / acc.size, 2);
    acc.level.avg = round(acc.level.total / acc.size, 2);
    acc.warden.avg = round(acc.warden.total / acc.size, 2);
    acc.class.counts = counts(acc.class.chars);
    acc.level.counts = counts(acc.level.chars);
    acc.warden.counts = counts(acc.warden.chars);
    acc.might.counts = counts(acc.might.chars);
    acc.tags.counts = counts(acc.tags.chars);

    return acc;
  }, acc);
};
