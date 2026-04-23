import { useRef } from "react";
import { CloseButton, TextInput as MantineTextInput } from "@mantine/core";
import { useDraftState } from "@/core/hooks";

export const TextInput = ({
  clearable = true,
  defaultValue,
  value,
  size = "md",
  onChange,
  onKeyDown,
  ...props
}) => {
  const ref = useRef();
  const [localValue, setLocalValue] = useDraftState(value || defaultValue);

  return (
    <MantineTextInput
      ref={ref}
      size={size}
      value={localValue}
      {...props}
      onChange={(e) => {
        setLocalValue(e.target.value);
        onChange?.(e);
      }}
      rightSection={
        props.rightSection || (clearable && !!localValue) ? (
          <CloseButton
            size={size}
            onClick={() => {
              setLocalValue("");
              ref.current?.focus();
            }}
          />
        ) : undefined
      }
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          setLocalValue(localValue);
          ref.current?.blur();
        }
        onKeyDown?.(e);
      }}
    />
  );
};
