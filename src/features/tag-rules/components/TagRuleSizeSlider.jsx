import { useCallback } from "react";
import { RangeSlider } from "@mantine/core";
import { deepEqual } from "fast-equals";
import { useDraftState, useStableCallback } from "@/core/hooks";
import { getNumberedArray } from "@/utils";

const marks = getNumberedArray(1, 20).map((n) => ({ value: n, label: n }));

export const TagRuleSizeSlider = ({
  defaultValue,
  value = defaultValue,
  onChange: propsOnChange,
}) => {
  const [draft, setDraft] = useDraftState(value);

  const onChange = useCallback(
    (value) => {
      setDraft(value);
    },
    [setDraft],
  );

  const onChangeEnd = useStableCallback((draft) => {
    if (!deepEqual(value, draft)) {
      propsOnChange(draft);
    }
  });

  return (
    <RangeSlider
      min={1}
      max={20}
      minRange={0}
      step={1}
      value={draft}
      onChange={onChange}
      onChangeEnd={onChangeEnd}
      marks={marks}
    />
  );
};
