import { useMemo, useState } from "react";
import {
  IconCopy,
  IconX,
  IconAlertCircle,
  IconArrowRight,
  IconRestore,
  IconSortAscendingNumbers,
  IconPlus,
  IconEdit,
  IconTrash,
} from "@tabler/icons-react";
import {
  ActionIcon,
  Accordion,
  Alert,
  Button,
  Box,
  Divider,
  Flex,
  InputLabel,
  Paper,
  Group,
  Grid,
  Text,
  Title,
  Tooltip,
  Stack,
  SimpleGrid,
  Switch,
} from "@mantine/core";
import classes from "./TagRules.module.css";
import { useRoute } from "wouter";
import { Aside, TagRulesetSelect, PageTitle } from "@/core/components";
import {
  useTagRulesManager,
  useTagRulesStoreApi as tagRulesApi,
  useConfirmationStore,
} from "@/core/store";
import { getNumberedArray } from "@/utils";
import { TagRulesNameModal } from "./TagRulesNameModal.jsx";
import { TagRuleModal } from "./TagRuleModal.jsx";
import { TagRule } from "./TagRule.jsx";
import { TagRulesNav } from "./TagRulesNav.jsx";
import { TagRuleSizeSlider } from "./TagRuleSizeSlider.jsx";
import { TagRulesetPreview } from "./TagRulesetPreview.jsx";
import { lintTagRuleset } from "@/core/schemas";

const SIZE_NUMBERS = getNumberedArray(1, 20);

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

const GridRow = ({ left, right, main, ...props }) => {
  return (
    <>
      <Grid.Col span={{ base: 12, md: 3, lg: 2 }} {...props}>
        {left}
      </Grid.Col>
      <Grid.Col span={{ base: 11, md: 8, lg: 9 }} {...props}>
        {main}
      </Grid.Col>
      <Grid.Col span={{ base: 1, md: 1, lg: 1 }} {...props}>
        {right}
      </Grid.Col>
    </>
  );
};

const LintAlert = ({ count, ...props }) => {
  return (
    <Alert
      variant="light"
      title="Warning: Overlapping Rules"
      icon={<IconAlertCircle />}
      {...props}
    >
      You have {count} rule(s) which have conflicting sizes. Rules that apply to
      the same group size must have unique type, value, and warden requirement.
      When there is a conflict, the rule with the higher size range wins.
    </Alert>
  );
};

export const TagRules = ({ type = "filters" }) => {
  const { getConfirmation } = useConfirmationStore();
  const [match, { id }] = useRoute("/filter-rulesets/:id?");
  const [ruleset = {}, setRuleset, api] = useTagRulesManager(type, id);
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

  const restoreCurrent = getConfirmation(
    (ie) => tagRulesApi.restoreDefaultSet(ruleset.id),
    {
      message:
        "This will restore this ruleset to its original defaults. This cannot be undone.",
    },
  );

  const removeCurrent = getConfirmation(
    () => {
      api.removeCurrent();
    },
    {
      title: "Are you sure you want to remove this ruleset?",
      message: "This cannot be undone.",
    },
  );

  return (
    <Box>
      <PageTitle
        title="Filter Rulesets"
        subtitle="Define how the party finder will compose your party"
      >
        <InputLabel
          display="flex"
          style={{ alignItems: "center", gap: 12, cursor: "pointer" }}
        >
          {api.currentActive && (
            <Text span c="bright" size="lg" flex="1">
              This is the active ruleset
            </Text>
          )}
          {!api.currentActive && (
            <Text span c="neutral" size="lg" flex="1">
              Click to activate
            </Text>
          )}
          <Switch
            mt={4}
            checked={api.currentActive}
            onChange={(e) => {
              if (e.currentTarget.checked) {
                api.activateCurrent();
              } else {
                api.deactivateCurrent();
              }
            }}
          />
        </InputLabel>
      </PageTitle>

      <PageTitle title={`Ruleset: ${ruleset.name}`} order={3} size="h3">
        {!api.currentDefault && (
          <>
            <Button
              aria-label="Remove ruleset"
              size="xs"
              variant="outline"
              leftSection={<IconTrash size={12} />}
              disabled={api.currentDefault}
              onClick={removeCurrent}
            >
              Remove
            </Button>
          </>
        )}

        {api.currentDefault && (
          <Tooltip
            openDelay={600}
            label="Restore this ruleset to its original default state"
          >
            <Button
              aria-label="Reset to defaults"
              disabled={!api.currentDefaultDirty}
              leftSection={<IconRestore size={12} />}
              onClick={restoreCurrent}
              size="xs"
              variant="outline"
            >
              Reset
            </Button>
          </Tooltip>
        )}

        <Button
          aria-label="Rename ruleset"
          leftSection={<IconEdit size={12} />}
          size="xs"
          variant="light"
          onClick={() => {
            setDraftRuleset(ruleset);
          }}
        >
          Rename
        </Button>

        <Tooltip
          openDelay={600}
          label="Create a copy of this ruleset and edit it immediately."
        >
          <Button
            leftSection={<IconCopy size={12} />}
            size="xs"
            onClick={() => api.duplicateCurrent()}
            variant="light"
          >
            Copy
          </Button>
        </Tooltip>

        {/* <Tooltip
          openDelay={600}
          label="Resorts rules by asceding size. For organization only, does not affect behavior."
        >
          <Button
            aria-label="Resort rules by ascending size"
            leftSection={<IconSortAscendingNumbers size={12} />}
            size="xs"
            variant="light"
            onClick={() => {
              api.sortCurrent();
            }}
          >
            Resort
          </Button>
        </Tooltip>*/}

        <Button
          aria-label="Add a rule"
          size="xs"
          leftSection={<IconPlus size={12} />}
          onClick={() => {
            setDraftTagRuleProps({});
          }}
        >
          Add Rule
        </Button>
      </PageTitle>

      <Aside>
        <Stack mt="md" gap={6}>
          <Button
            size="sm"
            leftSection={<IconPlus size={16} />}
            onClick={() => setDraftRuleset({ type })}
          >
            New Ruleset
          </Button>
          <TagRulesNav current={ruleset.id} />
        </Stack>
      </Aside>

      <Grid gutter="lg" align="stretch" my="lg">
        <GridRow
          display={{ base: "none", md: "block" }}
          left={<Text size="lg">Rules</Text>}
          main={
            <Text span size="lg">
              Party Sizes
            </Text>
          }
          style={{
            borderBottom: "1px dashed var(--mantine-color-default-border)",
            marginTop: 12,
            marginBottom: 12,
          }}
        />
        {!ruleset.rules.length && (
          <Grid.Col span={12} ta="center" p="3xl">
            <Text size="lg" mb="md">
              You have no rules defined in this ruleset.
            </Text>
            <Button size="md" onClick={() => setDraftTagRuleProps({})}>
              Add a rule now?
            </Button>
          </Grid.Col>
        )}
        {ruleset.rules.map((rule) => (
          <GridRow
            key={rule.id}
            className={newRule?.id === rule.id ? classes.highlightRow : ""}
            left={
              <TagRule
                rule={rule}
                conflicts={lintResult.errors[rule.id]}
                onClick={(rule) => setDraftTagRuleProps({ rule })}
              />
            }
            main={
              <TagRuleSizeSlider
                value={rule.size}
                mb={20}
                onChange={(size) => {
                  api.addCurrentRule({ ...rule, size });
                }}
              />
            }
            right={
              <Group gap={4} justify="flex-end">
                <EditButton
                  size="md"
                  onClick={() => setDraftTagRuleProps({ rule })}
                />
                <DeleteButton
                  size="md"
                  onClick={getConfirmation(() => api.removeCurrentRule(rule), {
                    title: "Are you sure you want to remove this rule?",
                  })}
                />
              </Group>
            }
          />
        ))}
        {!lintResult.ok && (
          <GridRow
            main={<LintAlert count={Object.keys(lintResult.errors).length} />}
          />
        )}
      </Grid>

      <Divider my="lg" />

      <Title order={4} size="h4" my="lg">
        Rule summaries by size
      </Title>
      <SimpleGrid cols={4} spacing="lg" mb={72}>
        {SIZE_NUMBERS.map((size) => (
          <Paper
            key={size}
            display="flex"
            py="xl"
            px="md"
            style={{ alignItems: "flex-start" }}
          >
            <Text size="4xl" pr="sm" c="gold" mt={6}>
              {size}
            </Text>
            <Box>
              <Text size="md">A party of {size} needs:</Text>
              <TagRulesetPreview.RulesList
                key={size}
                rules={api.currentPrepared[size]}
              />
            </Box>
          </Paper>
        ))}
      </SimpleGrid>

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
