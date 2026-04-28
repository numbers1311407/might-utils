import { useRef } from "react";
import { CloseButton, TextInput as MantineTextInput } from "@mantine/core";
import { mergeRefs } from "@mantine/hooks";
import { useDraftState } from "@/core/hooks";

export const TextInput = ({
  ref: propsRef,
  clearable = true,
  defaultValue = "",
  value,
  size = "md",
  onChange,
  onKeyDown,
  ...props
}) => {
  const localRef = useRef();
  const [localValue, setLocalValue] = useDraftState(value || defaultValue);
  const ref = mergeRefs(localRef, propsRef);

  return (
    <MantineTextInput
      size={size}
      value={localValue}
      ref={ref}
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
              localRef.current?.focus();
            }}
          />
        ) : undefined
      }
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          setLocalValue(localValue);
          localRef.current?.blur();
        }
        onKeyDown?.(e);
      }}
    />
  );
};
