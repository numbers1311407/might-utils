import { useState } from "react";
import { IconEdit, IconX } from "@tabler/icons-react";
import { ActionIcon, Button, Box, Group, Select, Table } from "@mantine/core";
import classes from "./TagRules.module.css";
import { RangeInput } from "@/core/components";

import {
  useTagRulesManager,
  useTagRulesSelectOptions,
  useTagRulesStoreApi as tagRulesApi,
} from "@/core/store";
import { TagRulesNameModal } from "./TagRulesNameModal.jsx";
import { TagRuleModal, TagRuleModalButton } from "./TagRuleModal.jsx";

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

export const TagRules = ({ type = "filters" }) => {
  const [ruleset = {}, setRuleset, api] = useTagRulesManager(type);
  const [draftRuleset, setDraftRuleset] = useState(null);
  const [draftTagRuleProps, setDraftTagRuleProps] = useState(null);
  const [newRule, setNewRule] = useState(null);

  const flashRuleRow = (rule) => {
    setNewRule(rule);
    setTimeout(() => {
      setNewRule(null);
    }, 1200);
  };

  const rows = Object.entries(ruleset.rules || []).reduce(
    (acc, [size, rules]) =>
      acc.concat(
        rules.map((rule) => (
          <Table.Tr
            key={rule.id}
            className={newRule?.id === rule.id ? classes.highlightRow : ""}
          >
            <Table.Td>{rule === rules[0] ? size : ""}</Table.Td>
            <Table.Td>{rule.type}</Table.Td>
            <Table.Td>{rule.value}</Table.Td>
            <Table.Td>{rule.range}</Table.Td>
            <Table.Td>{rule.warden}</Table.Td>
            <Table.Td>
              <Group gap={4}>
                <Button
                  onClick={() => setDraftTagRuleProps({ rule, ruleset, size })}
                />
                <DeleteButton
                  onClick={() => api.removeCurrentRule(size, rule)}
                />
              </Group>
            </Table.Td>
          </Table.Tr>
        )),
      ),
    [],
  );

  return (
    <Box>
      <RangeInput value="2,4" />
      <Group gap="xs" align="flex-end">
        <TagRuleSetSelect
          type={type}
          setValue={(id) => {
            setRuleset(tagRulesApi.getSet(id));
          }}
          value={ruleset.id}
        />

        <Button
          disabled={api.currentActive}
          onClick={() => api.activateCurrent()}
        >
          Set as Active
        </Button>

        <Button onClick={() => api.duplicateCurrent()}>Duplicate</Button>

        {!api.currentDefault && (
          <>
            <Button
              onClick={() => {
                setDraftRuleset(ruleset);
              }}
            >
              Rename
            </Button>
            <Button
              disabled={api.currentDefault}
              onClick={() => api.removeCurrent()}
            >
              Remove
            </Button>
          </>
        )}

        {api.currentDefault && (
          <Button
            disabled={!api.currentDefaultDirty}
            onClick={() => tagRulesApi.restoreDefaultSet(ruleset.id)}
          >
            Reset to defaults
          </Button>
        )}

        <Button onClick={() => setDraftRuleset({ type })}>New Ruleset</Button>

        <Button
          onClick={() => {
            setDraftTagRuleProps({});
          }}
        >
          New Rule
        </Button>
      </Group>

      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Size</Table.Th>
            <Table.Th>Type</Table.Th>
            <Table.Th>Value</Table.Th>
            <Table.Th>Range</Table.Th>
            <Table.Th>Warden</Table.Th>
            <Table.Th></Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>

      {draftRuleset && (
        <TagRulesNameModal
          ruleset={draftRuleset}
          onClose={() => {
            setDraftRuleset(null);
          }}
          onCommit={(ruleset) => {
            setDraftRuleset(null);
            tagRulesApi.addSet(ruleset, (set) => setRuleset(set));
          }}
        />
      )}

      {draftTagRuleProps && (
        <TagRuleModal
          {...draftTagRuleProps}
          opened
          onClose={() => {
            setDraftTagRuleProps(null);
          }}
          onSubmit={(size, rule) => {
            flashRuleRow(rule);
            setDraftTagRuleProps(null);
            api.addCurrentRule(size, rule);
          }}
        />
      )}
    </Box>
  );
};
