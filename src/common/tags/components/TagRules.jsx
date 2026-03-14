import { useState } from "react";
import { IconEdit, IconX } from "@tabler/icons-react";
import { ActionIcon, Button, Box, Group, Select, Table } from "@mantine/core";
import {
  useTagRulesManager,
  useTagRulesSelectOptions,
  useTagRulesStoreApi as tagRulesApi,
} from "../store";
import { TagRulesNameModal } from "./TagRulesNameModal.jsx";
import { TagRuleModal } from "./TagRuleModal.jsx";

const head = ["Size", "Type", "Value", "Range", "Warden", ""];

const stringifyWarden = (input) => {
  if (input === true) return "Rank 1+";
  return input < 0 ? "Any" : `Rank ${input}`;
};

const stringifyRange = (input) => {
  if (input === "*") return input;
  if (typeof input === "number") return `${input}`;
  if (input.length === 1) return `${input}+`;
  if (input[0] === 0) return `${input[1]}-`;
  return input.join("-");
};

const TagRuleSetSelect = ({ type, setValue, value }) => {
  const data = useTagRulesSelectOptions(type);

  return (
    <Select
      label="Rule Set"
      value={value}
      data={data}
      onChange={(value) => {
        // NOTE unsure if intended but if you click the current value in the
        // select it will call onChange with null. Preventing that from calling
        // upstream here.
        if (value) setValue(value);
      }}
    />
  );
};

const EditButton = (props) => (
  <ActionIcon aria-label="Edit" size="sm" {...props}>
    <IconEdit />
  </ActionIcon>
);

const DeleteButton = (props) => (
  <ActionIcon aria-label="Remove" size="sm" {...props}>
    <IconX />
  </ActionIcon>
);

const RowActions = ({ size, rule, ruleset, addRule, removeRule }) => {
  return (
    <Group gap={4}>
      <TagRuleModal
        rule={rule}
        ruleset={ruleset}
        size={size}
        onSubmit={addRule}
      />
      <DeleteButton onClick={removeRule} />
    </Group>
  );
};

const rulesToRow = (rules, ruleset, api, size) =>
  rules.map((rule) => [
    rule === rules[0] ? size : "",
    rule.type,
    rule.value,
    stringifyRange(rule.range),
    stringifyWarden(rule.warden),
    <RowActions
      rule={rule}
      size={size}
      ruleset={ruleset}
      addRule={(size, rule) => api.addCurrentRule(size, rule)}
      removeRule={() => api.removeCurrentRule(size, rule)}
    />,
  ]);

export const TagRules = ({ type = "filters" }) => {
  const [current = {}, setCurrent, api] = useTagRulesManager(type);
  const [draft, setDraft] = useState(null);

  const body = Object.entries(current.rules || []).reduce(
    (acc, [size, rules]) => {
      return acc.concat(rulesToRow(rules, current, api, size));
    },
    [],
  );

  return (
    <Box>
      <Group gap="xs" align="flex-end">
        <TagRuleSetSelect
          type={type}
          setValue={(id) => {
            setCurrent(tagRulesApi.getSet(id));
          }}
          value={current.id}
        />
        <Button
          disabled={api.currentActive}
          onClick={() => api.activateCurrent()}
        >
          Set as Active
        </Button>
        <Button onClick={() => api.duplicateCurrent()}>Duplicate</Button>
        <Button
          disabled={api.currentDefault}
          onClick={() => api.removeCurrent()}
        >
          Remove
        </Button>
        <Button
          onClick={() => {
            setDraft(current);
          }}
        >
          Rename
        </Button>
        {api.currentDefault && (
          <Button
            disabled={!api.currentDefaultDirty}
            onClick={() => tagRulesApi.restoreDefaultSet(current.id)}
          >
            Reset to defaults
          </Button>
        )}
        <Button
          onClick={() => {
            setDraft({ name: "", type, rules: {} });
          }}
        >
          New Ruleset
        </Button>
        <TagRuleModal
          onSubmit={(size, rule) => api.addCurrentRule(size, rule)}
        />
      </Group>
      <Table data={{ head, body }} />
      {draft && (
        <TagRulesNameModal
          ruleset={draft}
          onClose={() => {
            setDraft(null);
          }}
          onCommit={(ruleset) => {
            setDraft(null);
            tagRulesApi.addSet(ruleset, (set) => setCurrent(set));
          }}
        />
      )}
    </Box>
  );
};
