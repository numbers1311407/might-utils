import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@mantine/core/styles.css";
// import "react-querybuilder/dist/query-builder-layout.css";
import "react-querybuilder/dist/query-builder.css";
import "non.geist";
import "non.geist/mono";
import App from "@/app/index.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
