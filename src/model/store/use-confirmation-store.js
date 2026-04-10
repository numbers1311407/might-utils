import { create } from "zustand";

export const useConfirmationStore = create((set, get) => ({
  confirmCallback: null,
  cancelCallback: null,
  isOpen: false,
  props: null,
}));

const { getState: get, setState: set } = useConfirmationStore;

const api = {
  getConfirmation: (callback, options = {}) => {
    const { onCancel: cancelCallback, ...props } = options;

    return (...args) => {
      if (get().isOpen) return;

      set({
        cancelCallback: () => cancelCallback?.(),
        confirmCallback: () => callback(...args),
        isOpen: true,
        props,
      });
    };
  },

  reset: () => {
    set({
      cancelCallback: null,
      confirmCallback: null,
      isOpen: false,
      props: null,
    });
  },

  onCancel: async () => {
    const { cancelCallback } = get();

    try {
      await cancelCallback();
    } finally {
      api.reset();
    }
  },

  onConfirm: async () => {
    const { confirmCallback } = get();

    try {
      await confirmCallback();
    } finally {
      api.reset();
    }
  },
};

export const useConfirmationStoreApi = api;
export const getConfirmation = api.getConfirmation;
