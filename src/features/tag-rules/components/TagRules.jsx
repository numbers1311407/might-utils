import { Fragment, useMemo, useState } from "react";
import { IconEdit, IconX, IconAlertCircle } from "@tabler/icons-react";
import {
  ActionIcon,
  Alert,
  Button,
  Box,
  Grid,
  Group,
  Select,
  Text,
} from "@mantine/core";
import classes from "./TagRules.module.css";
import {
  useTagRulesManager,
  useTagRulesSelectOptions,
  useTagRulesStoreApi as tagRulesApi,
} from "@/core/store";
import { TagRulesNameModal } from "./TagRulesNameModal.jsx";
import { TagRuleModal } from "./TagRuleModal.jsx";
import { TagRule } from "./TagRule.jsx";
import { TagRuleSizeSlider } from "./TagRuleSizeSlider.jsx";
import { TagRulesetPreview } from "./TagRulesetPreview.jsx";
import { lintTagRuleset } from "@/core/schemas";

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

const LintAlert = ({ errors }) => {
  return (
    <Alert
      variant="light"
      title="Warning: Overlapping Rules"
      icon={<IconAlertCircle />}
    >
      You have {Object.keys(errors).length} rule(s) which have conflicting
      sizes. Rules that apply to the same group size must have unique type,
      value, and warden requirement. When there is a conflict, the rule with the
      higher size range wins.
    </Alert>
  );
};

export const TagRules = ({ type = "filters" }) => {
  const [ruleset = {}, setRuleset, api] = useTagRulesManager(type);
  const [draftRuleset, setDraftRuleset] = useState(null);
  const [draftTagRuleProps, setDraftTagRuleProps] = useState(null);
  const [newRule, setNewRule] = useState(null);

  const lintResult = useMemo(() => {
    return lintTagRuleset(ruleset);
  }, [ruleset]);

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
              aria-label="Rename ruleset"
              onClick={() => {
                setDraftRuleset(ruleset);
              }}
            >
              Rename
            </Button>
            <Button
              aria-label="Remove ruleset"
              disabled={api.currentDefault}
              onClick={() => api.removeCurrent()}
            >
              Remove
            </Button>
          </>
        )}

        {api.currentDefault && (
          <Button
            aria-label="Reset to defaults"
            disabled={!api.currentDefaultDirty}
            onClick={() => tagRulesApi.restoreDefaultSet(ruleset.id)}
          >
            Reset to defaults
          </Button>
        )}

        <Button onClick={() => setDraftRuleset({ type })}>New Ruleset</Button>

        <Button
          aria-label="Add a rule"
          onClick={() => {
            setDraftTagRuleProps({});
          }}
        >
          Add Rule
        </Button>

        <Button
          title="Resort rules from lowest to highest size range"
          aria-label="Resort rules"
          onClick={() => {
            api.sortCurrent();
          }}
        >
          Resort Rules
        </Button>
      </Group>

      {!lintResult.ok && <LintAlert errors={lintResult.errors} />}

      <Grid gutter="md" my={16}>
        <Grid.Col span={3}></Grid.Col>
        <Grid.Col span={7}>
          <TagRulesetPreview ruleset={ruleset} />
        </Grid.Col>
        <Grid.Col span={2}></Grid.Col>
        <Grid.Col span={3}>Rules</Grid.Col>
        <Grid.Col span={7}>
          <Text>Squad Sizes</Text>
        </Grid.Col>
        <Grid.Col span={2}></Grid.Col>
        {ruleset.rules.map((rule) => (
          <Fragment key={rule.id}>
            <Grid.Col span={3}>
              <TagRule
                rule={rule}
                conflicts={lintResult.errors[rule.id]}
                onClick={(rule) => setDraftTagRuleProps({ rule })}
              />
            </Grid.Col>
            <Grid.Col
              className={newRule?.id === rule.id ? classes.highlightRow : ""}
              span={7}
            >
              <TagRuleSizeSlider
                value={rule.size}
                onChange={(size) => {
                  api.addCurrentRule({ ...rule, size });
                }}
              />
            </Grid.Col>
            <Grid.Col span={2} my={8}>
              <EditButton onClick={() => setDraftTagRuleProps({ rule })} />
              <DeleteButton onClick={() => api.removeCurrentRule(rule)} />
            </Grid.Col>
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
            setDraftTagRuleProps(null);
            api.addCurrentRule(rule);
            api.sortCurrent();
            flashRuleRow(rule);
          }}
        />
      )}
    </Box>
  );
};
