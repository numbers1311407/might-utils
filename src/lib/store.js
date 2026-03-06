import superjson from "superjson";
import { useLocalStorage } from "@mantine/hooks";
import { defaultFindLineupsOptions as lineups } from "@/lib/lineups";
import { DemoRoster } from "@/lib/roster";

const defaultValue = {
  lineups,
  roster: DemoRoster,
};

export const useAppStorage = () => {
  const [data, setData] = useLocalStorage({
    key: "might-utils",
    defaultValue,
    // oddly this option seems to have the opposite effect of what it reads on the box.
    // Defaulting to true, on paper this sounds like it's a useful useEffect wrapper that
    // makes sure the read storage value triggers a re-render, but in practice it causes
    // the hook to *always* return the default value first, which just complicates the
    // handling of it forcing the code to expect a bad value up front. I'm unsure of the
    // real intention.
    getInitialValueInEffect: false,
    serialize: superjson.stringify,
    deserialize: (str) =>
      str === undefined ? defaultValue : superjson.parse(str),
  });

  return [data, setData];
};
