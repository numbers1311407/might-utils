import { create } from "zustand";

const emptyState = {
  closeCallback: null,
  Component: null,
  isOpen: false,
  modalProps: null,
  componentProps: null,
};

export const useModalStore = create((set, get) => ({
  ...emptyState,

  createModal: (Component, options = {}) => {
    const {
      onClose: propsOnClose,
      onDone: propsOnDone,
      modalProps = {},
      componentProps = {},
    } = options;

    return () => {
      const { isOpen, done, onClose } = get();

      if (isOpen) return;

      set({
        closeCallback: () => propsOnClose?.(),
        doneCallback: (...args) => propsOnDone?.(...args),
        Component,
        isOpen: true,
        modalProps: { onClose, size: "md", ...modalProps },
        componentProps: { done, cancel: close, ...componentProps },
      });
    };
  },

  close: () => {
    set({ ...emptyState });
  },

  done: async (...args) => {
    const { doneCallback, close } = get();

    try {
      await doneCallback(...args);
    } finally {
      close();
    }
  },

  onClose: async () => {
    const { closeCallback, close } = get();

    try {
      await closeCallback();
    } finally {
      close();
    }
  },
}));
