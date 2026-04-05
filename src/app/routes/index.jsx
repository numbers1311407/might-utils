import { Route } from "wouter";
import { PartyFinder } from "@/features/party-finder";
import { ClassTags } from "@/features/class-tags";
import { TagGroups } from "@/features/tag-groups";
import { InstanceCalculator } from "@/features/instance-calculator";
import { TagRules } from "@/features/tag-rules";
import { Roster, Parties } from "@/features/chars";

export const Routes = () => {
  return (
    <>
      <Route path="/">
        <PartyFinder />
      </Route>
      <Route path="/roster">
        <Roster />
      </Route>
      <Route path="/might-range-finder">
        <InstanceCalculator />
      </Route>
      <Route path="/npc-simulator">
        <InstanceCalculator />
      </Route>
      <Route path="/rulesets/:id?">
        <TagRules />
      </Route>
      <Route path="/class-tags">
        <ClassTags />
      </Route>
      <Route path="/tag-groups">
        <TagGroups />
      </Route>
      <Route path="/parties/:id?">
        <Parties />
      </Route>
    </>
  );
};
