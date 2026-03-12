import { Suspense } from "react";
import { Tabs, Loader } from "@mantine/core";
import { ClassTags } from "@/features/class-tags";
import { Roster } from "@/features/roster";
import { Route, useRoute, useLocation } from "wouter";
import { LineupsResults } from "./LineupsResults.jsx";
import { TagRules } from "@/common/tags/components";

export const LineupsMain = () => {
  const [, params] = useRoute("/might-utils/:page?");
  const [, navigate] = useLocation();
  const activeTab = params?.["page"] || "lineups";
  const onTabsChange = (tab) => {
    navigate(`/might-utils/${tab !== "lineups" ? tab : ""}`);
  };

  return (
    <Tabs
      defaultValue="lineups"
      value={activeTab}
      onChange={onTabsChange}
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
      <Tabs.Panel value="roster">
        <Roster />
      </Tabs.Panel>
      <Tabs.Panel value="class-tags">
        <ClassTags />
      </Tabs.Panel>
      <Tabs.Panel value="tag-rules">
        <TagRules />
      </Tabs.Panel>
    </Tabs>
  );
};
