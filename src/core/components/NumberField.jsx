import { useCallback } from "react";
import { NumberInput } from "@mantine/core";
import { useDraftState } from "@/core/hooks";
import { HelpLabel } from "./HelpLabel.jsx";
import css from "./NumberField.module.css";

const isNumber = (value) => value !== "" && !isNaN(value);

// This probably needs to be renamed but the point of this input is to
// exist as a self contained "form" with draft state and prevention of
// submission of blank/invalid input. (Don't ask why it's setValue and
// not onChange, there's no good answer)
export const NumberField = ({
  label: propsLabel,
  help,
  value,
  setValue,
  ...restProps
}) => {
  const min = restProps.min;
  const max = restProps.max;
  const [localValue, setLocalValue] = useDraftState(value);

  const commitValue = useCallback(
    ({ target }) => {
      if (!isNumber(target.value)) return;

      let v = Number(target.value);
      if (min !== undefined && v < min) {
        v = min;
      } else if (max !== undefined && v > max) {
        v = max;
      }
      setValue(v);
    },
    [setValue, min, max],
  );

  const blurOnEnter = useCallback(
    ({ key, target }) => {
      if (key === "Enter") target.blur();

      if (key === "Escape") {
        setLocalValue(value);
      }
    },
    [value],
  );

  return (
    <NumberInput
      label={propsLabel && <HelpLabel label={propsLabel} help={help} />}
      allowNegative={false}
      value={localValue}
      error={localValue === ""}
      classNames={{
        root: css.root,
        input: css.input,
        controls: css.control,
        control: css.control,
      }}
      onValueChange={(values, sourceInfo) => {
        const value = values.value;
        // this happens specifically when the increment buttons are clicked
        // on the field, whereupon we want the commit happen right away
        // instead of waiting on field blur as that feels very unintuitive.
        if (sourceInfo.source !== "event") {
          commitValue({ target: { value } });
          return;
        }
        setLocalValue(value);
      }}
      onKeyDown={blurOnEnter}
      onBlur={commitValue}
      {...restProps}
    />
  );
};
