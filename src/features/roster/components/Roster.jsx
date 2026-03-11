import { CloseButton, Box, Button, Stack, Switch } from "@mantine/core";
import { RosterCharModal } from "./RosterCharModal.jsx";
import { useRosterStore } from "../store";

export const RosterChar = ({ char, roster, update, remove }) => {
  return (
    <Box>
      <Box>
        {char.name}, {char.level}, rank {char.warden}
      </Box>
      <Box>
        <Switch
          aria-label="Toggle Active Status"
          checked={char.active}
          onChange={(e) => {
            update({ active: e.currentTarget.checked });
          }}
        />
        <RosterCharModal
          key={char.name}
          roster={roster}
          char={char}
          onSubmit={(char) => update(char)}
        />
        <CloseButton aria-label="Remove Character" onClick={() => remove()} />
      </Box>
    </Box>
  );
};

export const Roster = () => {
  const roster = useRosterStore((store) => store.roster);

  const addChar = useRosterStore((store) => store.addChar);
  const clearRoster = useRosterStore((store) => store.clearRoster);
  const removeChar = useRosterStore((store) => store.removeChar);
  const resetRoster = useRosterStore((store) => store.resetRoster);
  const updateChar = useRosterStore((store) => store.updateChar);

  return (
    <Box>
      <Box>
        <Button onClick={() => resetRoster()}>Reset Roster</Button>
        <Button onClick={() => clearRoster()}>Clear Roster</Button>
        <RosterCharModal
          key="new-char"
          roster={roster}
          onSubmit={(char) => addChar(char)}
        />
      </Box>
      <Stack>
        {roster.map((char) => (
          <RosterChar
            key={char.name}
            char={char}
            roster={roster}
            remove={() => removeChar(char)}
            update={(update) => {
              updateChar(char, update);
            }}
          />
        ))}
      </Stack>
    </Box>
  );
};
