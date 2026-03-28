/* eslint-disable no-undef */

import { defineConfig } from "vite";
import path from "path";
import react from "@vitejs/plugin-react";
import dsv from "@rollup/plugin-dsv";

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler", { target: "19" }]],
      },
    }),
    dsv(),
  ],
  base: "/might-utils/",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
