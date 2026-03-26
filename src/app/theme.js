import { createTheme } from "@mantine/core";

const mightColors = [
  "#f1f4fe",
  "#e4e6ed",
  "#c8cad3",
  "#a9adb9",
  "#9094a3",
  "#7f8496",
  "#777c91",
  "#63687c",
  "#595e72",
  "#4a5167",
];

export const theme = createTheme({
  colors: {
    mightColors,
  },
  primaryColor: "mightColors",
  breakpoints: {
    xs: "48em",
    sm: "62em",
    md: "75em",
    lg: "88em",
    xl: "110em",
  },
});
