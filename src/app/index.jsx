import { MantineProvider } from "@mantine/core";
import { Lineups } from "@/features/lineups";
import { theme } from "./theme.js";

function App() {
  return (
    <MantineProvider theme={theme} defaultColorScheme="dark">
      <Lineups />
    </MantineProvider>
  );
}

export default App;
