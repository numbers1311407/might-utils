import * as z from "zod";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  CopyButton,
  Group,
  Code,
  CloseButton,
  Button,
  List,
  Stack,
  Text,
  Textarea,
  UnstyledButton,
} from "@mantine/core";
import { useDraftState, useRoster } from "@/core/hooks";
import { parse } from "csv-parse/browser/esm/sync";
import { charSchema } from "@/model/schemas";
import { useRosterStoreApi as rosterApi } from "@/model/store";

const HEADER_ROW = ["name", "class", "level", "warden", "active", "tags"];

const RosterCopyButton = ({ value, ...buttonProps }) => {
  return (
    <CopyButton value={value} size="compact-md">
      {({ copied, copy }) => (
        <Button
          {...buttonProps}
          color={copied ? "teal" : undefined}
          onClick={copy}
        >
          {copied ? "Roster copied to clipboard!" : "Copy Roster"}
        </Button>
      )}
    </CopyButton>
  );
};

const useRosterCsv = () => {
  const roster = useRoster({ activeOnly: false });

  return useMemo(
    () =>
      roster
        ?.map((char) =>
          [
            char.name,
            char.class,
            char.level,
            char.warden,
            char.active ? 1 : 0,
            char.tags.length ? `"${char.tags.join(",")}"` : null,
          ]
            .filter((r) => r !== null)
            .join(", "),
        )
        .join("\n"),
    [roster],
  );
};

const parseDraft = (csv) => {
  return parse(`${HEADER_ROW}\n${csv}`, {
    trim: true,
    columns: true,
    relax_column_count_less: true,
    cast: (value, ctx) => {
      if (ctx.column === "tags") {
        return !value.length ? [] : value.split(/\s*,\s*/);
      }
      if (ctx.column === "active") {
        return value == "1" ? true : false;
      }
      return value;
    },
  });
};

const EXAMPLE_1 = `Stabz, ROG, 70, 3, 1, "sneaker,lover,fighter"
Bonkz, WAR, 65, 0, 0, "basher,smasher,sleepy"
`;

export const RosterImporter = () => {
  const csv = useRosterCsv();
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState(false);
  const [draft, setDraft] = useDraftState(csv);

  const inputRef = useRef();
  const copyRef = useRef();
  const copyCsv = () => {
    copyRef.current.click();
  };

  useEffect(() => {
    if (editing) inputRef.current.focus();
  }, [editing]);

  const submit = () => {
    const chars = [];
    let parsed;
    let passed = true;

    try {
      parsed = parseDraft(draft);
      console.log({ parsed });
    } catch (e) {
      setError(e.message);
      return;
    }

    if (!parsed.length) {
      cancelEditing();
    }

    for (let i = 0; i < parsed.length; i++) {
      const row = parsed[i];
      const result = charSchema.safeParse(row);
      if (result.success) {
        chars.push(result.data);
      } else {
        setError(
          `Line ${i + 1} "${row.name}": ${result.error.issues[0].message}`,
        );
        passed = false;
        break;
      }
    }
    if (passed) {
      try {
        rosterApi.syncChars(chars);
      } catch (e) {
        if (e instanceof z.ZodError) {
          console.error(e.issues);
          setError(e.issues[0]?.message);
        }
        throw e;
      }
      cancelEditing();
    }
  };

  const startEditing = () => {
    setEditing(true);
  };

  const cancelEditing = () => {
    setError(false);
    setEditing(false);
    setDraft(csv);
  };

  const clearAndFocus = () => {
    setDraft("");
    inputRef.current.focus();
  };

  return (
    <Stack p="md">
      <Group align="flex-start" gap="2xl">
        <Stack flex="1">
          <Textarea
            placeholder="If you're seeing this placeholder you have no characters in your roster. Follow the instructions here and import your characters in a batch, or go to the main roster and add them one at a time."
            disabled={!editing}
            value={draft}
            ref={inputRef}
            styles={{
              section: {
                alignSelf: "flex-start",
                top: 10,
                right: 10,
              },
            }}
            error={error}
            rightSection={
              editing &&
              draft.length && (
                <CloseButton
                  title="Clear"
                  v="outline"
                  onClick={clearAndFocus}
                />
              )
            }
            onChange={(e) => setDraft(e.target.value)}
            onKeyUp={() => setError(false)}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                cancelEditing();
              }
            }}
            label="Import/export your roster as CSV"
            rows={20}
          />
          <Group justify="flex-end" mt={-4} gap="xs">
            {editing && (
              <>
                <Button
                  size="compact-md"
                  variant="outline"
                  onClick={cancelEditing}
                >
                  Cancel Edit
                </Button>
                <Button
                  disabled={draft === csv}
                  size="compact-md"
                  onClick={submit}
                >
                  Submit
                </Button>
              </>
            )}
            {!editing && (
              <>
                <RosterCopyButton
                  ref={copyRef}
                  variant="outline"
                  size="compact-md"
                  value={csv}
                />
                <Button size="compact-md" onClick={startEditing}>
                  Edit
                </Button>
              </>
            )}
          </Group>
        </Stack>
        <Stack flex="1" mt={20} gap="sm">
          <Text size="sm">
            This field contains the serialized roster. Copy via the{" "}
            <UnstyledButton c="primary" onClick={copyCsv}>
              <Text span size="sm">
                Copy Roster
              </Text>
            </UnstyledButton>{" "}
            button for off-site backup/editing, or click the{" "}
            <UnstyledButton c="primary" onClick={startEditing}>
              <Text span c="primary">
                Edit
              </Text>
            </UnstyledButton>{" "}
            button to begin editing and submit when finished.
          </Text>
          <Text size="sm">
            If you have even a semi-large roster it's advisable to back it up
            just to make it easy to recreate if ever issues ever arise with your
            local website data.
          </Text>
          <Text size="sm">
            The format is: <br />
            <Text span c="primary">
              Name, Class Shortname, Level, Warden (0-3), Active, Tags
            </Text>
          </Text>
          <List size="xs">
            <List.Item>
              Tags should be wrapped in double quotes, joined by commas.
            </List.Item>
            <List.Item>Extra space around values is ignored.</List.Item>
            <List.Item>1 for active, 0 for inactive.</List.Item>
          </List>
          <Text size="sm">
            A realistic 2 character roster might look like this:
          </Text>
          <Code block c="blue" styles={{ root: { lineHeight: 1.5 } }}>
            {EXAMPLE_1}
          </Code>
          <Text size="sm">
            Note that character names{" "}
            <Text span fw="bold" c="primary">
              must be unique
            </Text>{" "}
            as they are used as each character's identifier. If you try to
            create two characters with the same name only the last one will be
            saved.
          </Text>
        </Stack>
      </Group>
    </Stack>
  );
};
