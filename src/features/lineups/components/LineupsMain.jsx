import { Suspense } from "react";
import { Tabs, Loader } from "@mantine/core";
import { LineupsResults } from "./LineupsResults.jsx";

export const LineupsMain = () => {
  return (
    <Tabs defaultValue="results" w="100%">
      <Tabs.List>
        <Tabs.Tab value="results">Results</Tabs.Tab>
        <Tabs.Tab value="roster">Roster</Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="results">
        <Suspense fallback={<Loader />}>
          <LineupsResults />
        </Suspense>
      </Tabs.Panel>
      <Tabs.Panel value="roster"></Tabs.Panel>
    </Tabs>
  );
};
