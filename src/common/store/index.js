import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

export const createStore = (name, storeFn) => {
  return create(persist(immer(storeFn), { name }));
};
