import { create } from "zustand";

const emptyState = {
  closeCallback: null,
  Component: null,
  isOpen: false,
  modalProps: null,
  componentProps: null,
};

export const useModalStore = create(() => ({
  ...emptyState,
}));

const { getState: get, setState: set } = useModalStore;

const api = {
  createModal: (Component, options = {}) => {
    const {
      onClose: _onClose,
      onDone: _onDone,
      modalProps: _modalProps = {},
      componentProps: _componentProps = {},
    } = options;

    return () => {
      if (get().isOpen) return;

      const { onClose, close, done } = api;

      const baseModalProps = { onClose, size: "md" };
      const baseComponentProps = { done, cancel: close };

      const modalProps =
        typeof _modalProps === "function"
          ? _modalProps(baseModalProps)
          : { ...baseModalProps, ..._modalProps };

      const componentProps =
        typeof _componentProps === "function"
          ? _componentProps(baseComponentProps)
          : { ...baseComponentProps, ..._componentProps };

      set({
        closeCallback: () => _onClose?.(),
        doneCallback: (...args) => _onDone?.(...args),
        Component,
        isOpen: true,
        modalProps,
        componentProps,
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
