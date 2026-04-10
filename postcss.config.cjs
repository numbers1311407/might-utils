import { breakpoints } from "./src/app/breakpoints.js";

module.exports = {
  plugins: {
    "postcss-preset-mantine": {},
    "postcss-simple-vars": {
      variables: Object.values(breakpoints).reduce(
        (acc, [size, em]) => ({
          ...acc,
          [`mantine-breakpoint-${size}`]: `${em}em`,
        }),
        {},
      ),
    },
  },
};
