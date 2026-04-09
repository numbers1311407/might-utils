import { useCallback, useState } from "react";
import { CalculatorContext } from "./calculator-context.js";

export const CALCULATOR_DEFAULT_INSTANCE = {
  tier: "T9",
  type: "raid",
  might: 1600,
  maxIntense: 768,
};

export const CALCULATOR_DEFAULT_MIGHT = 1600;
export const CALCULATOR_DEFAULT_DIFFICULTY = "N";
export const CALCULATOR_INTENSE_MULT_RAID = 0.48;
export const CALCULATOR_INTENSE_MULT_GROUP = 0.64;

export const CalculatorContextProvider = ({ children }) => {
  const [instance, setInstanceBase] = useState(CALCULATOR_DEFAULT_INSTANCE);
  const [might, setMight] = useState(CALCULATOR_DEFAULT_MIGHT);
  const [difficulty, setDifficulty] = useState(CALCULATOR_DEFAULT_DIFFICULTY);
  const setInstance = useCallback(
    (instance) => {
      setInstanceBase({
        ...instance,
        maxIntense:
          (instance.type === "raid"
            ? CALCULATOR_INTENSE_MULT_RAID
            : CALCULATOR_INTENSE_MULT_GROUP) * instance.might,
      });
    },
    [setInstanceBase],
  );

  const value = {
    instance,
    setInstance,
    might,
    setMight,
    difficulty,
    setDifficulty,
  };

  return <CalculatorContext value={value}>{children}</CalculatorContext>;
};
