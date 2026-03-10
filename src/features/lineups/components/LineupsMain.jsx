import { Suspense } from "react";
import { Tabs, Loader } from "@mantine/core";
import { LineupsResults } from "./LineupsResults.jsx";
import { ClassTags } from "./ClassTags.jsx";

export const LineupsMain = () => {
  return (
    <Tabs defaultValue="lineups" w="100%">
      <Tabs.List>
        <Tabs.Tab value="lineups">Find Lineups</Tabs.Tab>
        <Tabs.Tab value="roster">Roster</Tabs.Tab>
        <Tabs.Tab value="class-tags">Class Tags</Tabs.Tab>
        <Tabs.Tab value="tag-rules">Tag Rules</Tabs.Tab>
      </Tabs.List>
      <Suspense fallback={<Loader />}>
        <Tabs.Panel value="lineups">
          <LineupsResults />
        </Tabs.Panel>
        <Tabs.Panel value="roster">roster</Tabs.Panel>
        <Tabs.Panel value="class-tags">
          <ClassTags />
        </Tabs.Panel>
        <Tabs.Panel value="tag-rules">tag rules</Tabs.Panel>
      </Suspense>
    </Tabs>
  );
};
