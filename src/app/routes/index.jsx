import { Route } from "wouter";
import { Lineups, SavedLineups } from "@/features/lineups";
import { ClassTags } from "@/features/class-tags";
import { TagGroups } from "@/features/tag-groups";
import { TagRules } from "@/features/tag-rules";
import { Roster } from "@/features/roster";

export const Routes = () => {
  return (
    <>
      <Route path="/">
        <Lineups />
      </Route>
      <Route path="/roster">
        <Roster />
      </Route>
      <Route path="/tag-rules">
        <TagRules />
      </Route>
      <Route path="/class-tags">
        <ClassTags />
      </Route>
      <Route path="/tag-groups">
        <TagGroups />
      </Route>
      <Route path="/squads">
        <SavedLineups />
      </Route>
    </>
  );
};
