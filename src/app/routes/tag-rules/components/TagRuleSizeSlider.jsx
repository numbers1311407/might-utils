import { useCallback, useMemo } from "react";
import { RangeSlider } from "@mantine/core";
import { deepEqual } from "fast-equals";
import { useDraftState, useStableCallback } from "@/core/hooks";
import { useTagRulesStore } from "@/model/store";
import { getNumberedArray } from "@/utils";

export const TagRuleSizeSlider = ({
  defaultValue,
  value = defaultValue,
  onChange: propsOnChange,
  ...props
}) => {
  const [draft, setDraft] = useDraftState(value);
  const showTwenty = useTagRulesStore((store) => store.groupSizeTwenty);
  const marks = useMemo(
    () =>
      getNumberedArray(1, showTwenty ? 20 : 12).map((n) => ({
        value: n,
        label: n,
      })),
    [showTwenty],
  );

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
      max={showTwenty ? 20 : 12}
      minRange={0}
      step={1}
      value={draft}
      onChange={onChange}
      onChangeEnd={onChangeEnd}
      marks={marks}
      {...props}
    />
  );
};
