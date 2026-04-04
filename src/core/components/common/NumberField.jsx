import { useCallback } from "react";
import { NumberInput } from "@mantine/core";
import { useDraftState } from "@/core/hooks";
import { HelpLabel } from "./HelpLabel.jsx";

// NOTE for future reference if this component is confusing I'll save my future
// self the trouble of trying to figure out the point of this over NumberInput.
//
// This field is basically a standalone form that maintains internal state and
// only commits on blur, and does its best to prevent an invalid state by disallowing
// illegal changes. This make sense for its intention as a control for the party
// search feature, where you want to avoid unnecessary submits and you don't want
// the field to end up in an invalid state.
//
// Why I chose `setValue` over `onChange` as the prop is something I'd like to
// ask my past self. This could easily be changed in a refactor and that
// refactor should come with a better name.
//
// For that refactor, this component would be better off as an adapter around
// a number input, with opt-in for the different things this does to make it
// more useful in non standalone-input situations.
//
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
      label={propsLabel && <HelpLabel label={propsLabel} help={help} />}
      allowNegative={false}
      // Unsolved issue but doubling up on avoiding undefined being passed here as it
      // causes the NumberInput to behave unpredictably, sometimes filling with what
      // seems to be the last internally cached digit. Combined with the behavior of
      // the store reverting to default on empty it was creating some odd behavior.
      value={localValue ?? value}
      onChange={onChange}
      onValueChange={(values, sourceInfo) => {
        // this happens specifically when the increment buttons are clicked on the
        // field, whereupon we want the commit happen right away instead of waiting
        // on field blur as that feels very unintuitive.
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
