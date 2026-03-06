import { MantineProvider } from "@mantine/core";
import { theme } from "./theme.js";
import { Lineups } from "./components";

import "@mantine/core/styles.css";

function App() {
  // Quick hack to solve the bizarre fact that mantine's useLocalStorage will (by design)
  // immediately return the default value if localStorage is not yet ready.
  const ready =
    ("localStorage" in window && window.localStorage !== null) || null;

  return (
    <MantineProvider theme={theme} defaultColorScheme="dark">
      {ready && <Lineups />}
    </MantineProvider>
  );
}

export default App;
