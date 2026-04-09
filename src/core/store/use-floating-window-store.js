import * as z from "zod";
import { debounce } from "@/utils";
import { createStore } from "./helpers";

const AUTO_INITIAL_POSITION = {
  top: 30,
  left: 30,
};
const AUTO_POSITION_OFFSET = 30;
const INITIAL_Z_INDEX = 400;

const positionSchema = z
  .object({
    top: z.number().optional(),
    left: z.number().optional(),
    right: z.number().optional(),
    bottom: z.number().optional(),
  })
  .refine((obj) => Object.keys(obj).length == 2, {
    message: "you must specify only two corners e.g. top/left",
  });

export const useFloatingWindowStore = createStore(
  "might-utils-floating-windows",
  (set, get) => {
    const _setOpened = (name, opened) => {
      set(({ windows }) => {
        if (windows[name]) {
          windows[name].opened = opened;
        }
      });
    };

    const _shiftZindices = (name, state) => {
      const idx = state.stack.indexOf(name);
      if (idx !== 0) {
        if (idx !== -1) {
          state.stack = state.stack.filter((n) => n !== name);
        }
        state.stack.unshift(name);
        const len = state.stack.length;
        for (let i = 0; i < len; i++) {
          const _name = state.stack[i];
          state.windows[_name].zIndex = INITIAL_Z_INDEX + (len - i - 1);
        }
      }
    };

    return {
      stack: [],
      autoPositioned: [],
      windows: {},

      delete: (name) => {
        set(({ windows }) => {
          delete windows[name];
        });
      },

      open: (name) => {
        get().raise(name);
        _setOpened(name, true);
      },

      close: (name) => {
        _setOpened(name, false);
      },

      toggle: (name) => {
        const { close, open, windows } = get();

        if (windows[name].opened) {
          close(name);
        } else {
          open(name);
        }
      },

      reset: (name, initialPosition) => {
        set(({ windows }) => {
          if (windows[name]) {
            windows[name].opened = false;

            if (initialPosition) {
              const pos = positionSchema.parse(initialPosition);
              windows[name].currentPosition = pos;
              windows[name].initialPosition = pos;
            } else {
              windows[name].currentPosition = windows[name].initialPosition;
            }
          }
        });
      },

      resetAll: () => {
        const { stack, reset } = get();
        stack.forEach((name) => reset(name));
      },

      raise: (name) => {
        if (get().stack[0] === name) {
          return;
        }
        set((state) => {
          _shiftZindices(name, state);
        });
      },

      sync: (name, rawInitialPosition) => {
        const storePosition = debounce((pos) => {
          set(({ windows }) => {
            windows[name].currentPosition = {
              top: pos.y,
              left: pos.x,
            };
          });
        }, 400);

        set((state) => {
          const { [name]: storage = {} } = state.windows;

          let initialPosition;
          const autoPosSet = new Set(state.autoPositioned);

          if (rawInitialPosition === "auto") {
            if (!autoPosSet.has(name)) {
              initialPosition = {
                top:
                  AUTO_INITIAL_POSITION.top +
                  AUTO_POSITION_OFFSET * autoPosSet.size,
                left:
                  AUTO_INITIAL_POSITION.left +
                  AUTO_POSITION_OFFSET * autoPosSet.size,
              };
              autoPosSet.add(name);
            }
          } else {
            autoPosSet.delete(name);
            initialPosition = positionSchema.parse(rawInitialPosition);
          }

          state.autoPositioned = Array.from(autoPosSet);

          const { currentPosition = initialPosition } = storage;

          state.windows[name] = {
            ...state.windows[name],
            currentPosition,
            storePosition,
          };

          if (initialPosition) {
            state.windows[name].initialPosition = initialPosition;
          }

          _shiftZindices(name, state);
        });
      },
    };
  },
);
