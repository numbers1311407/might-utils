import { NumberInput } from "@mantine/core";
import { useCalculatorContext } from "../calculator-context.js";

export const CalculatorMightInput = (props) => {
  const { might, setMight } = useCalculatorContext();

  return (
    <NumberInput
      step={10}
      placeholder="Your party's might"
      size="md"
      leftSectionWidth={60}
      leftSectionProps={{
        style: {
          background: "var(--mantine-color-default-border)",
        },
      }}
      leftSection="Might"
      {...props}
      value={might}
      onChange={setMight}
      styles={{
        description: {
          fontSize: 13,
        },
        input: {
          paddingLeft: 70,
        },
        ...props.styles,
      }}
    />
  );
};
