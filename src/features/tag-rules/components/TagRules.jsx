import { Fragment, useState } from "react";
import { IconEdit, IconX } from "@tabler/icons-react";
import {
  ActionIcon,
  Button,
  Box,
  Grid,
  Group,
  Select,
  RangeSlider,
  Table,
  Text,
} from "@mantine/core";
import classes from "./TagRules.module.css";

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

const ResultsTable = ({ ruleset, newRule, api, setDraftTagRuleProps }) => {
  const rows = ruleset.rules.map((rule) => (
    <Table.Tr
      key={rule.id}
      className={newRule?.id === rule.id ? classes.highlightRow : ""}
    >
      <Table.Td>{rule.size.join(", ")}</Table.Td>
      <Table.Td>{rule.type}</Table.Td>
      <Table.Td>{rule.value}</Table.Td>
      <Table.Td>{rule.range}</Table.Td>
      <Table.Td>{rule.warden}</Table.Td>
      <Table.Td>
        <Group gap={4}>
          <Button onClick={() => setDraftTagRuleProps({ rule, ruleset })} />
          <DeleteButton onClick={() => api.removeCurrentRule(rule)} />
        </Group>
      </Table.Td>
    </Table.Tr>
  ));
  return (
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
  );
};

const humanizeRule = (rule) => {
  return (
    <>
      <Text size="xs">{rule.type}</Text>
      <Text size="xs" component="span">
        {rule.value}
      </Text>
      : <Text component="span">{rule.range}</Text>
    </>
  );
};

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

  return (
    <Box>
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

      <Grid gutter="md" my={16}>
        {ruleset.rules.map((rule) => (
          <Fragment key={rule.id}>
            <Grid.Col span={1}>{humanizeRule(rule)}</Grid.Col>
            <Grid.Col span={10} my={8}>
              <RangeSlider
                min={1}
                max={20}
                minRange={0}
                step={1}
                value={rule.size}
                marks={[
                  { value: 1, label: 1 },
                  { value: 3, label: 3 },
                  { value: 3, label: 3 },
                  { value: 6, label: 6 },
                  { value: 9, label: 9 },
                  { value: 12, label: 12 },
                  { value: 15, label: 15 },
                  { value: 18, label: 18 },
                  { value: 20, label: 20 },
                ]}
              />
            </Grid.Col>
            <Grid.Col span={1} my={8}></Grid.Col>
          </Fragment>
        ))}
      </Grid>

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
          onSubmit={(rule) => {
            flashRuleRow(rule);
            setDraftTagRuleProps(null);
            api.addCurrentRule(rule);
          }}
        />
      )}
    </Box>
  );
};
