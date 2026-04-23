import { useCallback, useState } from "react";
import { CalculatorContext } from "../calculator-context.js";
import {
  CALCULATOR_DEFAULT_DIFFICULTY,
  CALCULATOR_DEFAULT_INSTANCE,
  CALCULATOR_DEFAULT_MIGHT,
  CALCULATOR_INTENSE_MULT_GROUP,
  CALCULATOR_INTENSE_MULT_RAID,
} from "../calculator-constants.js";

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
