import { Button } from "@mantine/core";
import { Link } from "wouter";
import { useRosterStoreApi as rosterApi } from "@/model/store";
import { useRoster } from "@/core/hooks";
import { FloatingWindow } from "@/core/components/common";
import { CharsTable } from "./CharsTable.jsx";
import {
  useFloatingRoster,
  FLOATING_ROSTER_NAME,
} from "./use-floating-roster.js";

const HELP =
  "This is the active roster used to power the party generator. It's in a window " +
  "to make it easy to view and edit to control finder output.";

export const FloatingRoster = () => {
  const { api } = useFloatingRoster();
  const roster = useRoster({ activeOnly: false });

  const onUpdate = (id, char) => {
    rosterApi.updateChar(id, char);
  };

  return (
    <>
      <Button size="compact-md" onClick={api.toggle}>
        Character Roster
      </Button>
      <FloatingWindow
        name={FLOATING_ROSTER_NAME}
        w={475}
        help={HELP}
        p="lg"
        title="Character Roster"
      >
        <CharsTable
          chars={roster}
          isRoster={true}
          onUpdate={onUpdate}
          hideControls
          emptyContent={
            <>
              <Text size="lg" mb="md">
                You have no characters on your roster.
              </Text>
              <Button component={Link} size="md" href="/roster">
                Go to the roster?
              </Button>
            </>
          }
        />
      </FloatingWindow>
    </>
  );
};
