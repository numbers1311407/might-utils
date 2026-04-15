const { breakpoints } = require("./src/app/breakpoints.js");

module.exports = {
  plugins: {
    "postcss-preset-mantine": {},
    "postcss-simple-vars": {
      variables: Object.entries(breakpoints).reduce(
        (acc, [size, em]) => ({
          ...acc,
          [`mantine-breakpoint-${size}`]: em,
        }),
        {},
      ),
    },
  },
};
