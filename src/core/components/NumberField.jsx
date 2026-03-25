import { useCallback } from "react";
import { NumberInput } from "@mantine/core";
import { useDraftState } from "@/core/hooks";
import { HelpLabel } from "./HelpLabel.jsx";

export const NumberField = ({
  label: propsLabel,
  help,
  value,
  setValue,
  ...restProps
}) => {
  const [localValue, setLocalValue] = useDraftState(value);
  const min = restProps.min;
  const max = restProps.max;

  const commitValue = useCallback(
    ({ target }) => {
      if (target.value === "" || isNaN(target.value)) {
        setValue(undefined);
      } else {
        let v = Number(target.value);
        if (min !== undefined && v < min) {
          v = min;
        } else if (max !== undefined && v > max) {
          v = max;
        }
        setValue(v);
      }
    },
    [setValue, min, max],
  );

  const blurOnEnter = useCallback(({ key, target }) => {
    if (key === "Enter") target.blur();
  }, []);

  const onChange = (v) => {
    if (v === "") v = undefined;
    setLocalValue(v);
  };

  return (
    <NumberInput
      label={<HelpLabel label={propsLabel} help={help} />}
      allowNegative={false}
      // Unsolved issue but doubling up on avoiding undefined being passed here as it
      // causes the NumberInput to behave unpredictably, sometimes filling with what
      // seems to be the last internally cached digit. Combined with the behavior of
      // the store reverting to default on empty it was creating some odd behavior.
      value={localValue ?? value}
      onChange={onChange}
      onValueChange={(values, sourceInfo) => {
        if (sourceInfo.source !== "event") {
          commitValue({ target: { value: values.value } });
        }
      }}
      onKeyDown={blurOnEnter}
      onBlur={commitValue}
      {...restProps}
    />
  );
};
