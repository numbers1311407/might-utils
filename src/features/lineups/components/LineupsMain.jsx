import { Suspense } from "react";
import { Tabs, Loader } from "@mantine/core";
import { LineupsResults } from "./LineupsResults.jsx";
import { ClassTags } from "./ClassTags.jsx";
import { Route, useRoute, useLocation } from "wouter";

export const LineupsMain = () => {
  const [, params] = useRoute("/might-utils/:page?");
  const [location, navigate] = useLocation();
  const activeTab = params?.["page"] || "lineups";

  return (
    <Tabs
      defaultValue="lineups"
      value={activeTab}
      onChange={(tab) => {
        navigate(`/might-utils/${tab !== "lineups" ? tab : ""}`);
      }}
      w="100%"
    >
      <Tabs.List>
        <Tabs.Tab value="lineups">Find Lineups</Tabs.Tab>
        <Tabs.Tab value="roster">Roster</Tabs.Tab>
        <Tabs.Tab value="class-tags">Class Tags</Tabs.Tab>
        <Tabs.Tab value="tag-rules">Tag Rules</Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="lineups">
        <Route path="/might-utils/">
          <Suspense fallback={<Loader />}>
            <LineupsResults />
          </Suspense>
        </Route>
      </Tabs.Panel>
      <Tabs.Panel value="roster">roster</Tabs.Panel>
      <Tabs.Panel value="class-tags">
        <ClassTags />
      </Tabs.Panel>
      <Tabs.Panel value="tag-rules">tag rules</Tabs.Panel>
    </Tabs>
  );
};
