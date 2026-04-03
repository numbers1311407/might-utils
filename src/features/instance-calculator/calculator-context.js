import { use, createContext } from "react";

export const CalculatorContext = createContext({});
export const useCalculatorContext = () => use(CalculatorContext);
