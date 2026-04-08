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
}));

const { getState: get, setState: set } = useModalStore;

const api = {
  createModal: (Component, options = {}) => {
    const {
      onClose: propsOnClose,
      onDone: propsOnDone,
      modalProps = {},
      componentProps = {},
    } = options;

    return () => {
      if (get().isOpen) return;

      const { onClose, close, done } = api;

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
    const { doneCallback } = get();

    try {
      await doneCallback(...args);
    } finally {
      api.close();
    }
  },

  onClose: async () => {
    const { closeCallback } = get();

    try {
      await closeCallback();
    } finally {
      api.close();
    }
  },
};

export const useModalStoreApi = api;
export const createModal = api.createModal;
