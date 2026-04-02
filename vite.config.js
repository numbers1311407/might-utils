/* eslint-disable no-undef */

import { defineConfig } from "vite";
import path from "path";
import react from "@vitejs/plugin-react";
import { parseInstanceData } from "./scripts/parse-instance-data.js";

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler", { target: "19" }]],
      },
    }),
    parseInstanceData(),
  ],
  base: "/might-utils/",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
