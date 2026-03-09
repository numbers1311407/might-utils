import { useCallback } from "react";
import { Input, NumberInput } from "@mantine/core";
import { useDraftState } from "@/common/hooks";

export const NumberField = ({ label, value, setValue, ...restProps }) => {
  const [localValue, setLocalValue] = useDraftState(value);
  const min = restProps.min;
  const max = restProps.max;

  const commitValue = useCallback(
    ({ target }) => {
      if (isNaN(target.value)) {
        setValue(undefined);
      } else {
        let value = Number(target.value);
        if (min !== undefined && value < min) {
          value = min;
        } else if (max !== undefined && value > max) {
          value = max;
        }
        setValue(value);
      }
    },
    [setValue, min, max],
  );

  const blurOnEnter = useCallback(({ key, target }) => {
    if (key === "Enter") target.blur();
  }, []);

  return (
    <Input.Wrapper label={label}>
      <NumberInput
        allowNegative={false}
        value={localValue}
        onChange={setLocalValue}
        onKeyDown={blurOnEnter}
        onBlur={commitValue}
        {...restProps}
      />
    </Input.Wrapper>
  );
};
