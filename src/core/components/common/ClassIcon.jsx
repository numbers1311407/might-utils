import { alpha, Image } from "@mantine/core";

import BER from "@/assets/class-icons/ber.webp";
import BRD from "@/assets/class-icons/brd.webp";
import BST from "@/assets/class-icons/bst.webp";
import CLR from "@/assets/class-icons/clr.webp";
import DRU from "@/assets/class-icons/dru.webp";
import ENC from "@/assets/class-icons/enc.webp";
import MAG from "@/assets/class-icons/mag.webp";
import MNK from "@/assets/class-icons/mnk.webp";
import NEC from "@/assets/class-icons/nec.webp";
import PAL from "@/assets/class-icons/pal.webp";
import RNG from "@/assets/class-icons/rng.webp";
import ROG from "@/assets/class-icons/rog.webp";
import SHD from "@/assets/class-icons/shd.webp";
import SHM from "@/assets/class-icons/shm.webp";
import WAR from "@/assets/class-icons/war.webp";
import WIZ from "@/assets/class-icons/wiz.webp";

const icons = {
  BER,
  BRD,
  BST,
  CLR,
  DRU,
  ENC,
  MAG,
  MNK,
  NEC,
  PAL,
  RNG,
  ROG,
  SHD,
  SHM,
  WAR,
  WIZ,
};

const defaultSize = 42;

export const ClassIcon = ({ cls, size = defaultSize, ...props }) => (
  <Image
    radius={2}
    h={`${size}px`}
    w={`${size}px`}
    p={1}
    bg={alpha("var(--mantine-color-yellow-3)", 0.8)}
    {...props}
    src={icons[cls]}
  />
);
