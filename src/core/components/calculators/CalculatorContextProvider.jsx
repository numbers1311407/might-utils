import { useState } from "react";
import { CalculatorContext } from "./calculator-context.js";

export const CALCULATOR_DEFAULT_INSTANCE = {
  tier: "T9",
  type: "raid",
  might: 1600,
};

export const CALCULATOR_DEFAULT_MIGHT = 1600;
export const CALCULATOR_DEFAULT_DIFFICULTY = "N";

export const CalculatorContextProvider = ({ children }) => {
  const [instance, setInstance] = useState(CALCULATOR_DEFAULT_INSTANCE);
  const [might, setMight] = useState(CALCULATOR_DEFAULT_MIGHT);
  const [difficulty, setDifficulty] = useState(CALCULATOR_DEFAULT_DIFFICULTY);
  const maxIntense = (instance.type === "raid" ? 0.48 : 0.64) * instance.might;

  const value = {
    instance,
    setInstance,
    might,
    setMight,
    difficulty,
    setDifficulty,
    maxIntense,
  };

  return <CalculatorContext value={value}>{children}</CalculatorContext>;
};
