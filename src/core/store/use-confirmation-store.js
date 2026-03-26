import { create } from "zustand";

export const useConfirmationStore = create((set, get) => ({
  confirmCallback: null,
  cancelCallback: null,
  isOpen: false,
  props: null,

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
    const { cancelCallback, reset } = get();

    try {
      await cancelCallback();
    } finally {
      reset();
    }
  },

  onConfirm: async () => {
    const { confirmCallback, reset } = get();

    try {
      await confirmCallback();
    } finally {
      reset();
    }
  },
}));
