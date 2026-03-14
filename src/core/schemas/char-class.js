import * as z from "zod";

export const charClassSchema = z.enum(
  [
    "BER",
    "BRD",
    "BST",
    "CLR",
    "DRU",
    "ENC",
    "MAG",
    "MNK",
    "NEC",
    "PAL",
    "RNG",
    "ROG",
    "SHD",
    "SHM",
    "WAR",
    "WIZ",
  ],
  {
    message: 'Expected a 3-letter class abbreviation, e.g. "WAR"',
  },
);
