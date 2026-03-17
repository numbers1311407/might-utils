import { useState } from "react";
import { Box, UnstyledButton } from "@mantine/core";
import { getNumberedArray } from "@/utils";
import cls from "./RangeInput.module.css";

export const RangeInput = ({ value, min = 1, max = 20 }) => {
  const [[a, b], setValue] = useState(value.split(","));

  const c = (v) => v >= a && v <= b;
  const g = (n) => () => {
    if (Math.abs(b - n) >= Math.abs(a - n)) {
      setValue([n, b]);
    } else {
      setValue([a, n]);
    }
  };

  return (
    <Box className={cls.container}>
      {getNumberedArray(min, max).map((n) => (
        <UnstyledButton
          key={n}
          className={[cls.item, c(n) ? cls.selected : ""]}
          onClick={g(n)}
        >
          {n}
        </UnstyledButton>
      ))}
    </Box>
  );
};
