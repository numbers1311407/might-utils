import { useState } from "react";
import { Box, NumberInput, Select, SimpleGrid } from "@mantine/core";
import { useStableCallback } from "@/core/hooks";

const determineInitialMode = (value) => {
  if (value.length === 1) return "gte";
  if (value.length === 0 || value[0] === value[1]) return "exact";
  if (value[0] === 0) return "lte";
  return "between";
};

const MODES = {
  Between: "between",
  Exact: "exact",
  AtLeast: "gte",
  AtMost: "lte",
};

const MODE_OPTIONS = [
  { value: MODES.Between, label: "Between" },
  { value: MODES.Exact, label: "Exactly" },
  { value: MODES.AtLeast, label: "At Least" },
  { value: MODES.AtMost, label: "At Most" },
];

const MODE_PLACEHOLDERS = {
  [MODES.Between]: ["Min Count", "Max Count"],
  [MODES.Exact]: ["Count"],
  [MODES.AtLeast]: ["Min Count"],
  [MODES.AtMost]: ["Max Count"],
};

const ModeSelect = ({ value, onChange }) => {
  const [lastMode, setLastMode] = useState(value);

  return (
    <Select
      placeholder="Mode"
      value={value}
      onChange={(mode) => {
        onChange?.(mode, lastMode);
        setLastMode(mode);
      }}
      data={MODE_OPTIONS}
      allowDeselect={false}
    />
  );
};

const SingleInput = ({ value, mode, onChange: propsOnChange }) => {
  const placeholders = MODE_PLACEHOLDERS[mode];

  const onChange = useStableCallback((val) => {
    val = Number(val);
    const adaptedVal = {
      [MODES.Exact]: [val, val],
      [MODES.AtLeast]: [val],
      [MODES.AtMost]: [0, val],
    }[mode];
    propsOnChange?.(adaptedVal);
  });

  return (
    <NumberInput
      placeholder={placeholders[0]}
      defaultValue={1}
      value={value[mode === MODES.AtMost ? 1 : 0]}
      onChange={onChange}
      step={1}
      min={1}
      max={20}
    />
  );
};

const MultiInput = ({ value, mode, onChange }) => {
  const placeholders = MODE_PLACEHOLDERS[mode];

  return (
    <>
      <NumberInput
        placeholder={placeholders[0]}
        value={value[0]}
        defaultValue={0}
        onChange={(v) => onChange([Number(v), value[1]])}
        step={1}
        min={0}
        max={20}
      />
      <NumberInput
        placeholder={placeholders[placeholders.length - 1]}
        defaultValue={1}
        value={value[1]}
        onChange={(v) => onChange([value[0], Number(v)])}
        step={1}
        min={1}
        max={20}
      />
    </>
  );
};

export const ModalRangeInput = ({
  value,
  onChange: propsOnChange,
  ...containerProps
}) => {
  const [mode, setMode] = useState(determineInitialMode(value));
  const Input = mode === MODES.Between ? MultiInput : SingleInput;

  const onChange = useStableCallback((value) => {
    propsOnChange?.(value);
  });

  const onModeChange = useStableCallback((mode, lastMode) => {
    let emitVal;

    switch (mode) {
      case MODES.Between:
        // only emit if val length is 1, otherwise any previous range is fine
        if (value.length === 1) {
          emitVal = [value[0], value[0]];
        }
        break;
      case MODES.AtLeast:
        // going to atLeast always triggers change because we're going to 1 len.
        // default to the smallest value > 0 or insert 1
        emitVal = [Math.max(1, Math.min(...value))];
        break;
      case MODES.AtMost:
        // going to atMost, we only change if the previous value was 1 len or
        // the previous value did not have a min 0 already
        if (value.length === 1) {
          emitVal = [0, value[0]];
        } else if (value[0] !== 0) {
          emitVal = [0, value[1]];
        }
        break;
      case MODES.Exact:
        let v;
        // for exact, default to the low bound if at least, or the high bound
        // otherwise, witha min of 0. If the low bound === the high bound do nothing
        if (value.length === 1) {
          v = Math.max(1, value[0] || 0);
        } else if (value[0] !== value[1]) {
          v = Math.max(1, Math.min(...value));
        }
        if (v) {
          emitVal = [v, v];
        }
        break;
    }

    setMode(mode);

    if (emitVal) {
      onChange(emitVal);
    }
  });

  return (
    <Box py={4} {...containerProps} component={SimpleGrid} cols={3}>
      <ModeSelect value={mode} onChange={onModeChange} />
      <Input mode={mode} value={value} onChange={onChange} />
    </Box>
  );
};
